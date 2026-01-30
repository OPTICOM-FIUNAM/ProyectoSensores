#include <WiFi.h>
#include <HTTPClient.h>
#include <map>

// --- CONFIGURACIÓN DE RED ---
const char* ssid = "ASUS_sensores_2026";
const char* password = "Opticom_sensores_2026";
const char* serverUrl = "http://192.168.10.201:5000/descarga";

// ==========================================================
//              CONFIGURACIÓN DE LA SIMULACIÓN
// ==========================================================
const int DESCARGAS_POR_HORA = 200; // <--- CAMBIA ESTE NÚMERO AQUÍ
// ==========================================================

// --- PARÁMETROS DE FILTRADO ---
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

// Función para calcular el siguiente intervalo aleatorio basado en la meta/hora
long calcularSiguienteIntervalo() {
    // 3600 segundos tiene una hora. 
    // Dividimos 3600 / descargas para obtener el intervalo promedio en segundos.
    long promedioSegundos = 3600 / DESCARGAS_POR_HORA;
    
    // Creamos un rango de +/- 20% para que no parezca un reloj exacto
    long minSeg = promedioSegundos * 0.8;
    long maxSeg = promedioSegundos * 1.2;
    
    return random(minSeg, maxSeg + 1);
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
        delay(200);
        Serial.print(".");
    }
    Serial.println("\nWiFi Conectado. IP: " + WiFi.localIP().toString());

    xTaskCreatePinnedToCore(sensingLogic, "SensingTask", 10000, NULL, 1, &TaskSensing, 0);
    
    // Programar primer envío
    proximoEnvioSimulado = millis() + (calcularSiguienteIntervalo() * 1000);
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
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/json");
        String json = "{\"sensor\":\"" + id + "\", \"intensidad\":" + String(intensidad) + "}";
        int httpResponseCode = http.POST(json);
        Serial.printf("ENVÍO: %s | Resp: %d\n", id.c_str(), httpResponseCode);
        http.end();
    }
}

void loop() {
    unsigned long ahora = millis();

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
    delay(1000);
}