int intensidadPWM;
int PWM_PIN=9;
int A_0=0;
int duracion_ms=1000;
void setVibracion( int duracion_ms) {
}

void setup() {
  // put your setup code here, to run once:
  pinMode(PWM_PIN,OUTPUT);
  pinMode(A0,INPUT); 
  Serial.begin(9600);
}

void loop() {
  
  // put your main code here, to run repeatedly:
  A_0=analogRead(A0);
  intensidadPWM=map(A_0,0,1024,0,255);
  Serial.println(intensidadPWM);
  //// 1. Inicia la vibracion con la intensidad deseada
  analogWrite(PWM_PIN, intensidadPWM);
  //// 2. Mantiene la intensidad durante el tiempo especificado
  //delay(duracion_ms);
  //// 3. Detiene la vibracion (ciclo de trabajo al 0%)
  //analogWrite(PWM_PIN, 0);
  //// Pausa mınima de 100 ms para estabilizacion
  delay(50);
  
}
