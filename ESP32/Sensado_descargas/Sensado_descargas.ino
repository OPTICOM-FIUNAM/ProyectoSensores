#include <WiFi.h>
#include <HTTPClient.h>
#include <map>

// --- CONFIGURACIÓN DE RED ---
//const char* ssid = "IZZI-0E2C";
//const char* password = "Z44A0DPQVGTY";
//const char* ssid = "Opticom";
//const char* password = "%L0$.ErR0re$.$oN.d3.Lui$%";
const char* ssid = "ASUS_sensores_2026";
const char* password = "Opticom_sensores_2026";

// SUSTITUYE CON LA IP DE TU COMPUTADORA
//const char* serverUrl = "http://10.66.66.208:5000/descarga";
//const char* serverUrl = "http://192.168.10.173:5000/descarga";
const char* serverUrl = "http://192.168.10.179:5000/descarga"; //Optiserver
// --- PARÁMETROS DE FILTRADO ---
const int VENTANA_MS = 250;    // Tiempo para evaluar la vibración
const int UMBRAL_PULSOS = 45;  // Mínimo de pulsos para considerar descarga real
const int LOCKOUT_MS = 2000;   // Tiempo muerto tras una detección válida

struct Sensor {
    String id;
    int pin;
    int contadorPulsos;
    unsigned long tiempoInicio;
    bool evaluando;
    unsigned long tiempoBloqueo;
};

// Mapeo de los 16 sensores (Pines basados en tu código anterior)
std::map<int, Sensor> sensores;
int pines[] = {12, 13, 14, 15, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35};

// Task para el Core 0
TaskHandle_t TaskSensing;

void setup() {
    Serial.begin(115200);
    
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

    // Crear tarea en Core 0 para el sensado de alta velocidad
    xTaskCreatePinnedToCore(sensingLogic, "SensingTask", 10000, NULL, 1, &TaskSensing, 0);
}

void sensingLogic(void * pvParameters) {
    for (;;) {
        unsigned long ahora = millis();

        for (auto &it : sensores) {
            Sensor &s = it.second;
            bool lectura = digitalRead(s.pin);

            // Si no está bloqueado por una detección previa
            if (ahora > s.tiempoBloqueo) {
                
                // Inicia ventana al detectar primer pulso
                if (lectura && !s.evaluando) {
                    s.evaluando = true;
                    s.tiempoInicio = ahora;
                    s.contadorPulsos = 0;
                }

                // Contar pulsos durante la ventana
                if (s.evaluando) {
                    if (lectura) s.contadorPulsos++;

                    // Al terminar la ventana, evaluar densidad
                    if (ahora - s.tiempoInicio >= VENTANA_MS) {
                        if (s.contadorPulsos >= UMBRAL_PULSOS) {
                            notificarDescarga(s.id, s.contadorPulsos);
                            s.tiempoBloqueo = ahora + LOCKOUT_MS; // Bloqueo preventivo
                        }
                        s.evaluando = false;
                    }
                }
            }
        }
        delay(1); // Pequeño respiro para el Watchdog
    }
}

void notificarDescarga(String id, int intensidad) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/json");

        // Enviamos el ID y la intensidad (densidad de pulsos) para análisis en PC
        String json = "{\"sensor\":\"" + id + "\", \"intensidad\":" + String(intensidad) + "}";
        int httpResponseCode = http.POST(json);
        
        Serial.printf("Descarga detectada en %s (Intensidad: %d). Server: %d\n", id.c_str(), intensidad, httpResponseCode);
        http.end();
    }
}

void loop() {
    // El loop queda libre para tareas de mantenimiento o debug
    delay(1000);
}
