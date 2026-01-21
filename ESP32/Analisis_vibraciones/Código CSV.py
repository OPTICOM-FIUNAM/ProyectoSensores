import serial
import csv
import time
from datetime import datetime

PUERTO = "COM4"
ARCHIVO = "Registro.csv"

print("Iniciando comunicación con la ESP32")

try:
    conexion = serial.Serial(PUERTO, 115200)
    time.sleep(2)
    conexion.reset_input_buffer()
except serial.SerialException:
    print("No se pudo abrir")
    exit()

print("Conexión establecida\n")

with open(ARCHIVO, "w", newline="") as archivo:
    writer = csv.writer(archivo)
    writer.writerow(["Tiempo", "Vibracion"])

    try:
        while True:
            linea = conexion.readline().decode("utf-8").strip()

            if linea == "0" or linea == "1":
                valor = int(linea)
                tiempo = datetime.now().strftime("%H:%M:%S")

                writer.writerow([tiempo, valor])
                print(f"{tiempo}  |  {valor}")

    except KeyboardInterrupt:
        print("\nLectura finaliza")

conexion.close()
print("Puerto cerrado y datos guar")