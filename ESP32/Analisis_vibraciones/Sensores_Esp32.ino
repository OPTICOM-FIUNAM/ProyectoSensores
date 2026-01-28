void setup() {
  Serial.begin(115200);
  pinMode(21, INPUT);
}

void loop() {
  int estado = digitalRead(21);
  Serial.println(estado);
  delay(200);
}