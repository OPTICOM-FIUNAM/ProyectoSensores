import requests
from flask import Flask, render_template, request, jsonify
import threading, time, csv, os, socket
from datetime import datetime

app = Flask(__name__)

# ==========================================================
#                   CONFIGURACIÓN PRINCIPAL
# ==========================================================
TELEGRAM_TOKEN = "8277379621:AAEmbl-Vg95NXZ9OQVE2sJByK0ppyk12Q5k"
TELEGRAM_CHAT_ID = "5607220799"
INTERVALO_GUARDADO_SEG = 60  # Reporte cada 30 min
TIEMPO_ALERTA_INACTIVIDAD = 600 # Alerta tras 10 min
NOMBRE_CARPETA = "logs_reportes"
# ==========================================================

PINES = [12, 13, 14, 15, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35]
estado_sensores = {str(p): {"active": False, "intensity": 0, "last_seen": 0, "count": 0} for p in PINES}
total_global = 0
buffer_descargas = []
historial_reciente = []
ultima_comunicacion = time.time()
alerta_enviada = False # Variable para el watchdog
ip_esp32_actual = None
lock = threading.Lock()

def enviar_telegram(mensaje):
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
        requests.post(url, json={"chat_id": TELEGRAM_CHAT_ID, "text": mensaje, "parse_mode": "Markdown"}, timeout=5)
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

def hilo_guardado_ciclico():
    global buffer_descargas
    while True:
        time.sleep(INTERVALO_GUARDADO_SEG)
        with lock:
            if buffer_descargas:
                timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M')
                nombre_archivo = f"reporte_{timestamp}.csv"
                ruta_archivo = os.path.join(NOMBRE_CARPETA, nombre_archivo)
                with open(ruta_archivo, mode='w', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow(['Hora', 'Sensor', 'Pulsos'])
                    writer.writerows(buffer_descargas)
                
                enviar_telegram(f"✅ *NUEVO REPORTE GENERADO*\n📄 `{nombre_archivo}`\n📊 Eventos: {len(buffer_descargas)}")
                buffer_descargas.clear()
            else:
                enviar_telegram("ℹ️ Periodo cumplido sin descargas.")

def hilo_watchdog():
    global alerta_enviada # Corregido: indispensable para que funcione
    while True:
        time.sleep(30)
        ahora = time.time()
        if (ahora - ultima_comunicacion) > TIEMPO_ALERTA_INACTIVIDAD:
            if not alerta_enviada:
                enviar_telegram("⚠️ ¡ALERTA! ESP32 desconectada o inactiva.")
                alerta_enviada = True
        else:
            alerta_enviada = False

@app.route('/')
def index():
    return render_template('dashboard.html', pines=PINES)

@app.route('/status')
def get_status():
    global total_global
    ahora = time.time()
    sensors_list = []
    for p in PINES:
        s = estado_sensores[str(p)]
        is_active = (ahora - s["last_seen"] < 10) 
        sensors_list.append({"active": is_active, "intensity": s["intensity"], "count": s["count"]})
    
    # Nuevo: Enviamos estado de conexión y la IP al dashboard
    esp_online = (ahora - ultima_comunicacion < 30)
    return jsonify({
        "esp_online": esp_online,
        "esp_ip": ip_esp32_actual or "No registrada",
        "sensors": sensors_list, 
        "total_global": total_global,
        "recientes": historial_reciente[-10:]
    })

@app.route('/descarga', methods=['POST'])
def recibir_descarga():
    global total_global, ultima_comunicacion
    try:
        data = request.get_json()
        sid = data.get('sensor').replace("ID_", "")
        intensidad = data.get('intensidad')
        hora_actual = datetime.now().strftime('%H:%M:%S')
        ultima_comunicacion = time.time() 
        with lock:
            total_global += 1
            if sid in estado_sensores:
                estado_sensores[sid]["count"] += 1
                estado_sensores[sid]["last_seen"] = time.time()
                estado_sensores[sid]["intensity"] = intensidad
            buffer_descargas.append([hora_actual, sid, intensidad])
            historial_reciente.append({"hora": hora_actual, "sensor": sid, "intensidad": intensidad})
            if len(historial_reciente) > 50: historial_reciente.pop(0)
        return jsonify({"status": "ok"}), 200
    except:
        return jsonify({"status": "error"}), 500

@app.route('/inicio', methods=['POST'])
def anunciar_inicio():
    global ip_esp32_actual, ultima_comunicacion
    try:
        data = request.get_json()
        ip_esp32_actual = data.get('ip', 'Desconocida')
        ultima_comunicacion = time.time() # Actualizamos para avisar que está viva
        hora = datetime.now().strftime('%H:%M:%S')
        
        enviar_telegram(f"🚀 *SISTEMA REINICIADO*\n📡 ESP32 Online en: `{ip_esp32_actual}`\n⏰ {hora}")
        return jsonify({"status": "recibido"}), 200
    except Exception as e:
        print(f"[ERROR INICIO] {e}")
        return jsonify({"status": "error"}), 500

@app.route('/mandar_reinicio', methods=['POST'])
def mandar_reinicio():
    if not ip_esp32_actual:
        return jsonify({"status": "error", "message": "Sin IP registrada"}), 400
    try:
        requests.get(f"http://{ip_esp32_actual}/reset", timeout=5)
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists(NOMBRE_CARPETA):
        os.makedirs(NOMBRE_CARPETA)
    ip_local = obtener_ip_local()
    print(f"\n🚀 Servidor activo en http://{ip_local}:5000")
    threading.Thread(target=hilo_guardado_ciclico, daemon=True).start()
    threading.Thread(target=hilo_watchdog, daemon=True).start()
    app.run(host='0.0.0.0', port=5000, debug=False)