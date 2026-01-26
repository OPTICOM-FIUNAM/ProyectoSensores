import serial
import csv
import time
import os  # Importamos os para verificar si el archivo ya existe
from datetime import datetime
import sys

# --- CONFIGURACIÓN ---
PUERTO = "/dev/cu.usbserial-0001"
BAUD_RATE = 115200
NOMBRE_ARCHIVO = "Registro_Vibracion.csv"

print("--- MONITOR DE VIBRACIÓN ESP32 ---")
print(f"Intentando conectar a {PUERTO}...")

# 1. Intentar conexión Serial
conexion = None
try:
    conexion = serial.Serial(PUERTO, BAUD_RATE, timeout=1)
    time.sleep(2) # Espera a que el ESP32 se reinicie tras conectar
    conexion.reset_input_buffer() # Limpia basura inicial
except serial.SerialException as e:
    print(f"ERROR CRÍTICO: No se pudo conectar al puerto {PUERTO}")
    print(f"Detalle: {e}")
    sys.exit(1)

print("Conexión establecida. Esperando datos...\n")

# 2. Verificar si el archivo ya existe para saber si poner encabezados
archivo_existe = os.path.isfile(NOMBRE_ARCHIVO)

# Usamos modo "a" (append) para AGREGAR datos, no "w" (que los borra)
with open(NOMBRE_ARCHIVO, "a", newline="") as archivo:
    writer = csv.writer(archivo)

    # Solo escribimos los títulos si el archivo es nuevo
    if not archivo_existe:
        writer.writerow(["Fecha_Hora", "Vibracion"])
        print("Archivo nuevo creado con encabezados.")
    else:
        print("Añadiendo datos a archivo existente.")

    try:
        while True:
            # Verificamos si hay datos esperando para leer
            if conexion.in_waiting > 0:
                try:
                    # Leemos y limpiamos
                    linea = conexion.readline().decode("utf-8", errors='ignore').strip()

                    # Validamos que sea un dato válido (0 o 1)
                    if linea in ["0", "1"]:
                        valor = int(linea)
                        tiempo_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                        # Escribimos en CSV
                        writer.writerow([tiempo_actual, valor])
                        
                        # --- MEJORA CLAVE: FLUSH ---
                        # Fuerza a guardar en el disco duro inmediatamente
                        archivo.flush() 

                        # Feedback visual
                        estado = "DETECTADO" if valor == 1 else "Normal"
                        print(f"[{tiempo_actual}] Valor: {valor} -> {estado}")
                    
                except ValueError:
                    # Si llega algo que no se puede convertir, lo ignoramos
                    pass

    except KeyboardInterrupt:
        print("\n\nLectura finalizada por el usuario.")

    finally:
        # Este bloque siempre se ejecuta, haya error o no
        if conexion and getattr(conexion, "is_open", False):
            try:
                conexion.close()
            except Exception:
                pass
        print("Puerto serial cerrado correctamente.")
        print(f"Datos guardados en: {NOMBRE_ARCHIVO}")