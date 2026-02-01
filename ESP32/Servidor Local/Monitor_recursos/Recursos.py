import psutil
import csv
import time
from datetime import datetime
import os

# ==========================================
#               CONFIGURACIÓN
# ==========================================
CARPETA_DESTINO = "C:/Users/darki/Documents/ProyectoSensores-1/ESP32/Servidor Local/Monitor_recursos/reportes_sistema"
NOMBRE_ARCHIVO = "uso_recursos_alta_res.csv"
INTERVALO_SEG = 1 

# Crear la ruta completa
ruta_completa = os.path.join(CARPETA_DESTINO, NOMBRE_ARCHIVO)

def monitorear():
    # Crear la carpeta si no existe
    if not os.path.exists(CARPETA_DESTINO):
        os.makedirs(CARPETA_DESTINO)
        print(f"📁 Carpeta '{CARPETA_DESTINO}' creada.")

    print(f"📊 Monitoreo de ALTA RESOLUCIÓN iniciado.")
    print(f"📍 Guardando en: {os.path.abspath(ruta_completa)}")
    
    # Encabezados
    if not os.path.exists(ruta_completa):
        with open(ruta_completa, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Timestamp', 'CPU_Porcentaje', 'RAM_Porcentaje'])

    try:
        while True:
            ahora = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            cpu = psutil.cpu_percent(interval=None) # interval=None para no bloquear el bucle
            ram = psutil.virtual_memory().percent
            
            with open(ruta_completa, 'a', newline='') as f:
                writer = csv.writer(f)
                writer.writerow([ahora, cpu, ram])
            
            time.sleep(INTERVALO_SEG)
    except KeyboardInterrupt:
        print("\n🛑 Monitoreo detenido.")

if __name__ == "__main__":
    monitorear()