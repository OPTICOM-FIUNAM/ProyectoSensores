#include <WiFi.h>
#include <HTTPClient.h>
#include <map>
#include <WebServer.h>

// --- CONFIGURACIÓN DE RED ---
//const char* ssid = "IZZI-0E2C";
//const char* password = "Z44A0DPQVGTY";
const char* ssid = "ASUS_sensores_2026";
const char* password = "Opticom_sensores_2026";

// ==========================================================
// CENTRALIZACIÓN DE SERVIDOR (Cambia solo esto)
// ==========================================================
//const char* serverIP = "192.168.0.50"; 
const char* serverIP = "10.66.66.178"; 
const String baseAddr = "http://" + String(serverIP) + ":5000";
// ==========================================================

WebServer server_esp(80); 

void handleReset() {
    server_esp.send(200, "text/plain", "Reiniciando...");
    delay(500);
    ESP.restart();
}

const int DESCARGAS_POR_HORA = 600;
const int VENTANA_MS = 250;
const int UMBRAL_PULSOS = 45;
const int LOCKOUT_MS = 2000;

unsigned long proximoEnvioSimulado = 0;

struct Sensor {
    String id;
    int pin;
    int contadorPulsos;
    unsigned long tiempoInicio;
    bool evaluando;
    unsigned long tiempoBloqueo;
};

std::map<int, Sensor> sensores;
int pines[] = {12, 13, 14, 15, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35};
TaskHandle_t TaskSensing;

long calcularSiguienteIntervalo() {
    long promedioSegundos = 3600 / DESCARGAS_POR_HORA;
    long minSeg = promedioSegundos * 0.8;
    long maxSeg = promedioSegundos * 1.2;
    return random(minSeg, maxSeg + 1);
}

void anunciarPresencia() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String urlInicio = baseAddr + "/inicio"; // Usa la dirección global
        http.begin(urlInicio);
        http.addHeader("Content-Type", "application/json");

        String json = "{\"mensaje\":\"ESP32 Online\", \"ip\":\"" + WiFi.localIP().toString() + "\"}";
        int httpResponseCode = http.POST(json);

        if (httpResponseCode > 0) {
            Serial.println("✅ Notificación de inicio enviada al servidor.");
        }
        http.end();
    }
}

void setup() {
    Serial.begin(115200);
    randomSeed(analogRead(0));

    for (int p : pines) {
        pinMode(p, INPUT);
        sensores[p] = {"ID_" + String(p), p, 0, 0, false, 0};
    }

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi Conectado. IP: " + WiFi.localIP().toString());

    // NOTIFICAR AL SERVIDOR (Ahora que ya hay WiFi)
    anunciarPresencia();

    xTaskCreatePinnedToCore(sensingLogic, "SensingTask", 10000, NULL, 1, &TaskSensing, 0);
    
    proximoEnvioSimulado = millis() + (calcularSiguienteIntervalo() * 1000);
    server_esp.on("/reset", HTTP_GET, handleReset); 
    server_esp.begin();
}

void sensingLogic(void * pvParameters) {
    for (;;) {
        unsigned long ahora = millis();
        for (auto &it : sensores) {
            Sensor &s = it.second;
            bool lectura = digitalRead(s.pin);
            if (ahora > s.tiempoBloqueo) {
                if (lectura && !s.evaluando) {
                    s.evaluando = true;
                    s.tiempoInicio = ahora;
                    s.contadorPulsos = 0;
                }
                if (s.evaluando) {
                    if (lectura) s.contadorPulsos++;
                    if (ahora - s.tiempoInicio >= VENTANA_MS) {
                        if (s.contadorPulsos >= UMBRAL_PULSOS) {
                            notificarDescarga(s.id, s.contadorPulsos);
                            s.tiempoBloqueo = ahora + LOCKOUT_MS;
                        }
                        s.evaluando = false;
                    }
                }
            }
        }
        delay(1);
    }
}

void notificarDescarga(String id, int intensidad) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String urlDescarga = baseAddr + "/descarga"; // Usa la dirección global
        http.begin(urlDescarga);
        http.addHeader("Content-Type", "application/json");
        String json = "{\"sensor\":\"" + id + "\", \"intensidad\":" + String(intensidad) + "}";
        int httpResponseCode = http.POST(json);
        Serial.printf("ENVÍO: %s | Resp: %d\n", id.c_str(), httpResponseCode);
        http.end();
    }
}

void loop() {
    unsigned long ahora = millis();
    server_esp.handleClient(); 

    if (ahora >= proximoEnvioSimulado) {
        int indice = random(0, 16);
        String idSimulado = "ID_" + String(pines[indice]);
        int intensidadSimulada = random(UMBRAL_PULSOS, 150);

        Serial.print("[MODO SIMULACIÓN] ");
        notificarDescarga(idSimulado, intensidadSimulada);

        long espera = calcularSiguienteIntervalo();
        proximoEnvioSimulado = ahora + (espera * 1000);
        Serial.printf("Esperando %ld segundos para el siguiente dato ficticio.\n", espera);
    }
}