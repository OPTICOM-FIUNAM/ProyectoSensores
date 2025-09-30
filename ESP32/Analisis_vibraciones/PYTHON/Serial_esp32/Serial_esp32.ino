/*
  Prueba de sensibilidad de sensores de vibración SW_420
*/
#include <BluetoothSerial.h>
BluetoothSerial SerialBT;

const int NUM_SENSORS = 16;
int value = 0; 
const int sensorPins[NUM_SENSORS] = {12, 13, 14, 15, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35};
int state[NUM_SENSORS] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};

void setup() {
  Serial.begin(115200);
  SerialBT.begin("ESP32");
  for (int i = 0; i < NUM_SENSORS; i++) {
    pinMode(sensorPins[i], INPUT);
  }
}

void loop() {
  //unsigned long currentTime = millis();
  //Serial.print(currentTime);
  for (int i = 0; i < NUM_SENSORS; i++){
      value = digitalRead(sensorPins[i]);
        Serial.print("S");
        Serial.print(sensorPins[i]);
        Serial.print(":");
        Serial.print(value);
        Serial.print(" ");

//        SerialBT.print("S");
//        SerialBT.print(sensorPins[i]);
//        SerialBT.print(":");
//        SerialBT.print(value);
//        SerialBT.print(" ");
//        Serial.print(state[i]);       
  }
  Serial.println("");
  //SerialBT.println("");
  delay(10);
}