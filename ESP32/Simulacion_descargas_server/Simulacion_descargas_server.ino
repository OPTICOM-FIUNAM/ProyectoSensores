#include <WiFi.h>
#include <HTTPClient.h>
#include <map>

// --- CONFIGURACIÓN DE RED ---
const char* ssid = "ASUS_sensores_2026";
const char* password = "Opticom_sensores_2026";
const char* serverUrl = "http://192.168.10.201:5000/descarga";

// --- PARÁMETROS DE FILTRADO ---
const int VENTANA_MS = 250;
const int UMBRAL_PULSOS = 45;
const int LOCKOUT_MS = 2000;

// --- VARIABLES PARA SIMULACIÓN ---
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

void setup() {
    Serial.begin(115200);
    
    // Inicializar semilla aleatoria para la simulación
    randomSeed(analogRead(0));

    // Inicializar sensores
    for (int p : pines) {
        pinMode(p, INPUT);
        sensores[p] = {"ID_" + String(p), p, 0, 0, false, 0};
    }

    // Conexión WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(200);
        Serial.print(".");
    }
    Serial.println("\nWiFi Conectado. IP: " + WiFi.localIP().toString());

    // Crear tarea en Core 0 para el sensado real
    xTaskCreatePinnedToCore(sensingLogic, "SensingTask", 10000, NULL, 1, &TaskSensing, 0);
    
    // Programar el primer envío simulado
    proximoEnvioSimulado = millis() + (random(180, 241) * 1000);
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
        
        Serial.printf("EVENTO en %s (Intensidad: %d). Server: %d\n", id.c_str(), intensidad, httpResponseCode);
        http.end();
    }
}

void loop() {
    unsigned long ahora = millis();

    // LÓGICA DE SIMULACIÓN PARA FIN DE SEMANA
    if (ahora >= proximoEnvioSimulado) {
        // 1. Elegir sensor aleatorio de los 16 disponibles
        int indice = random(0, 16);
        int pinSimulado = pines[indice];
        String idSimulado = "ID_" + String(pinSimulado);
        
        // 2. Generar intensidad aleatoria por encima del umbral
        int intensidadSimulada = random(UMBRAL_PULSOS, 180);

        Serial.print("[SIMULACIÓN ACTIVADA] ");
        notificarDescarga(idSimulado, intensidadSimulada);

        // 3. Programar siguiente envío (entre 3 y 4 minutos para dar 15-20 por hora)
        long siguienteIntervalo = random(180, 241);
        proximoEnvioSimulado = ahora + (siguienteIntervalo * 1000);
        
        Serial.printf("Próximo dato ficticio en %ld segundos.\n", siguienteIntervalo);
    }

    // Pequeño retardo para no saturar el Core 1
    delay(1000);
}