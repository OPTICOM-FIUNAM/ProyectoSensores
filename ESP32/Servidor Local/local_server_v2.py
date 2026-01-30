import requests
from flask import Flask, render_template, request, jsonify
import threading, time, csv, os, socket
from datetime import datetime

app = Flask(__name__)

# --- CONFIGURACIÓN DE TELEGRAM ---
TELEGRAM_TOKEN = "TU_TOKEN_AQUI"
TELEGRAM_CHAT_ID = "TU_ID_AQUI"

# --- TIEMPOS DE CONTROL ---
INTERVALO_GUARDADO = 7200  # 2 horas en segundos
TIEMPO_ALERTA_MS = 600     # 10 minutos de inactividad
# -------------------------

PINES = [12, 13, 14, 15, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35]
estado_sensores = {str(p): {"active": False, "intensity": 0, "last_seen": 0, "count": 0} for p in PINES}
total_global = 0
buffer_descargas = []
ultima_comunicacion = time.time()
alerta_enviada = False
lock = threading.Lock()

def enviar_telegram(mensaje):
    """Envía una notificación al celular."""
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
        payload = {"chat_id": TELEGRAM_CHAT_ID, "text": mensaje}
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        print(f"[ERROR TELEGRAM] {e}")

def obtener_ip_local():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 1))
        IP = s.getsockname()[0]
    except Exception: IP = '127.0.0.1'
    finally: s.close()
    return IP

def hilo_guardado_cada_2h():
    """Genera un archivo nuevo y limpia el buffer cada 2 horas."""
    global buffer_descargas
    while True:
        time.sleep(INTERVALO_GUARDADO) 
        with lock:
            if buffer_descargas:
                timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M')
                nombre_archivo = f"reporte_2h_{timestamp}.csv"
                with open(nombre_archivo, mode='w', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow(['Hora', 'Sensor', 'Pulsos'])
                    writer.writerows(buffer_descargas)
                
                enviar_telegram(f"✅ Reporte generado: {nombre_archivo}\nTotal descargas: {len(buffer_descargas)}")
                buffer_descargas.clear() # Limpiamos para el siguiente bloque de 2 horas
                print(f"[SISTEMA] Archivo de 2 horas generado: {nombre_archivo}")

def hilo_watchdog():
    """Vigila si la ESP32 deja de enviar datos."""
    global alerta_enviada
    while True:
        time.sleep(30) # Revisa cada 30 segundos
        ahora = time.time()
        if (ahora - ultima_comunicacion) > TIEMPO_ALERTA_MS:
            if not alerta_enviada:
                msg = "⚠️ ¡ALERTA! La ESP32 no ha enviado datos en los últimos 10 minutos. Revisa la conexión."
                print(msg)
                enviar_telegram(msg)
                alerta_enviada = True
        else:
            alerta_enviada = False

@app.route('/')
def index(): return render_template('dashboard.html', pines=PINES)

@app.route('/status')
def get_status():
    global total_global
    ahora = time.time()
    sensors_list = []
    for p in PINES:
        s = estado_sensores[str(p)]
        is_active = (ahora - s["last_seen"] < 3)
        sensors_list.append({"active": is_active, "intensity": s["intensity"], "count": s["count"]})
    return jsonify({"sensors": sensors_list, "total_global": total_global})

@app.route('/descarga', methods=['POST'])
def recibir_descarga():
    global total_global, ultima_comunicacion
    try:
        data = request.get_json()
        sid = data.get('sensor').replace("ID_", "")
        ultima_comunicacion = time.time() # Resetear reloj de vida
        with lock:
            total_global += 1
            if sid in estado_sensores:
                estado_sensores[sid]["count"] += 1
                estado_sensores[sid]["last_seen"] = time.time()
                estado_sensores[sid]["intensity"] = data.get('intensidad')
            buffer_descargas.append([datetime.now().strftime('%H:%M:%S'), sid, data.get('intensidad')])
        return jsonify({"status": "ok"}), 200
    except Exception as e:
        return jsonify({"status": "error"}), 500

if __name__ == '__main__':
    ip_local = obtener_ip_local()
    print(f"\n🚀 Servidor activo en http://{ip_local}:5000")
    enviar_telegram(f"🟢 Servidor de Monitoreo Iniciado en IP: {ip_local}")

    # Iniciar los dos hilos de control
    threading.Thread(target=hilo_guardado_cada_2h, daemon=True).start()
    threading.Thread(target=hilo_watchdog, daemon=True).start()
    
    app.run(host='0.0.0.0', port=5000, debug=False)