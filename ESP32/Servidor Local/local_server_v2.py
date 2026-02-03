import requests
from flask import Flask, render_template, request, jsonify
import threading, time, csv, os, socket
from datetime import datetime

app = Flask(__name__)

# --- CONFIGURACIÓN ---
TELEGRAM_TOKEN = "8277379621:AAEmbl-Vg95NXZ9OQVE2sJByK0ppyk12Q5k"
TELEGRAM_CHAT_ID = ["5607220799", "-1003685218604"]
NOMBRE_CARPETA = "logs_reportes"
MINUTES = 5
INTERVALO_GUARDADO_SEG = (60*MINUTES)  # 30 min

PINES = [12, 13, 14, 15, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35]
estado_sensores = {str(p): {"active": False, "intensity": 0, "last_seen": 0, "count": 0} for p in PINES}
total_global = 0
buffer_descargas = []
historial_reciente = []
ultima_comunicacion = time.time()
ip_esp32_actual = None
lock = threading.Lock()

def enviar_telegram(mensaje):
    """Envía mensaje simple a Telegram."""
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    for chat_id in TELEGRAM_CHAT_IDS:
        try:
            payload = {
                "chat_id": chat_id, 
                "text": mensaje, 
                "parse_mode": "Markdown"
            }
            response = requests.post(url, json=payload, timeout=5)
            if response.status_code != 200:
                print(f"⚠️ Error enviando a {chat_id}: {response.text}")
        except Exception as e:
            print(f"❌ Fallo de conexión al enviar a {chat_id}: {e}")

def obtener_ip_local():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 1))
        return s.getsockname()[0]
    except: return '127.0.0.1'
    finally: s.close()

def hilo_guardado_ciclico():
    """Genera un archivo nuevo y avisa por Telegram cada X tiempo."""
    global buffer_descargas
    while True:
        time.sleep(INTERVALO_GUARDADO_SEG) 
        with lock:
            if buffer_descargas:
                timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M')
                nombre_archivo = f"reporte_{timestamp}.csv"
                ruta_archivo = os.path.join(NOMBRE_CARPETA, nombre_archivo)
                
                # Guardar el archivo
                with open(ruta_archivo, mode='w', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow(['Hora', 'Sensor', 'Pulsos'])
                    writer.writerows(buffer_descargas)
                
                # Notificación a Telegram
                enviar_telegram(f"✅ *REPORTE GENERADO*\n📄 `{nombre_archivo}`\n📊 Eventos: {len(buffer_descargas)}\n📈 Total: {total_global}")
                
                buffer_descargas.clear() 
                print(f"[SISTEMA] Reporte guardado: {nombre_archivo}")
            else:
                print("[SISTEMA] Periodo cumplido sin datos nuevos.")

@app.route('/')
def index(): return render_template('dashboard.html', pines=PINES)

@app.route('/status')
def get_status():
    ahora = time.time()
    sensors_list = []
    for p in PINES:
        s = estado_sensores[str(p)]
        sensors_list.append({"active": (ahora - s["last_seen"] < 10), "intensity": s["intensity"], "count": s["count"]})
    
    return jsonify({
        "esp_online": (ahora - ultima_comunicacion < 30),
        "esp_ip": ip_esp32_actual or "Desconocida",
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
        ultima_comunicacion = time.time()
        with lock:
            total_global += 1
            if sid in estado_sensores:
                estado_sensores[sid].update({"count": estado_sensores[sid]["count"]+1, "last_seen": time.time(), "intensity": data.get('intensidad')})
            buffer_descargas.append([datetime.now().strftime('%H:%M:%S'), sid, data.get('intensidad')])
            historial_reciente.append({"hora": datetime.now().strftime('%H:%M:%S'), "sensor": sid, "intensidad": data.get('intensidad')})
            if len(historial_reciente) > 50: historial_reciente.pop(0)
        return jsonify({"status": "ok"}), 200
    except: return jsonify({"status": "error"}), 500

@app.route('/inicio', methods=['POST'])
def anunciar_inicio():
    global ip_esp32_actual, ultima_comunicacion
    data = request.get_json()
    ip_esp32_actual = data.get('ip')
    ultima_comunicacion = time.time()
    enviar_telegram(f"🚀 *DISPOSITIVO ONLINE*\nIP: `{ip_esp32_actual}`")
    return jsonify({"status": "ok"}), 200

@app.route('/mandar_reinicio', methods=['POST'])
def mandar_reinicio():
    if not ip_esp32_actual: return jsonify({"status": "error"}), 400
    try:
        requests.get(f"http://{ip_esp32_actual}/reset", timeout=5)
        return jsonify({"status": "success"}), 200
    except: return jsonify({"status": "error"}), 500

if __name__ == '__main__':
    if not os.path.exists(NOMBRE_CARPETA): 
        os.makedirs(NOMBRE_CARPETA)
    
    mi_ip = obtener_ip_local()
    # ESTE ES EL MENSAJE QUE NO VEÍAS: Ahora se envía con confirmación en consola
    print(f"Enviando notificación de arranque a Telegram...")
    enviar_telegram(f"🖥️ *SERVIDOR INICIADO*\n📍 IP: `{mi_ip}`\n📁 Logs: `{NOMBRE_CARPETA}`")
    
    # --- AÑADE ESTA LÍNEA AQUÍ ---
    threading.Thread(target=hilo_guardado_ciclico, daemon=True).start()
    # -----------------------------

    print(f"🚀 Dashboard: http://{mi_ip}:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)