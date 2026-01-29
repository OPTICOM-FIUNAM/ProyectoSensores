from flask import Flask, render_template, request, jsonify
import threading, time, csv, os
from datetime import datetime

app = Flask(__name__)

# Configuración del proyecto de ingeniería
PINES = [12, 13, 14, 15, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35]
estado_sensores = {str(p): {"active": False, "intensity": 0, "last_seen": 0, "count": 0} for p in PINES}
total_global = 0
buffer_descargas = []
current_filename = "Esperando..."
lock = threading.Lock()

def hilo_guardado():
    global current_filename, buffer_descargas
    while True:
        time.sleep(60*60) # Guardado periódico de 1 minuto
        with lock:
            if buffer_descargas:
                timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M')
                current_filename = f"log_vibracion_{timestamp}.csv"
                with open(current_filename, mode='w', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow(['Hora', 'Sensor', 'Pulsos'])
                    writer.writerows(buffer_descargas)
                buffer_descargas.clear()

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
        is_active = (ahora - s["last_seen"] < 3) # Se mantiene activo 3 seg para visualización
        sensors_list.append({"active": is_active, "intensity": s["intensity"], "count": s["count"]})
    return jsonify({"current_file": current_filename, "sensors": sensors_list, "total_global": total_global})

@app.route('/descarga', methods=['POST'])
def recibir_descarga():
    global total_global
    data = request.get_json()
    sid = data.get('sensor').replace("ID_", "")
    with lock:
        total_global += 1
        if sid in estado_sensores:
            estado_sensores[sid]["count"] += 1
            estado_sensores[sid]["last_seen"] = time.time()
            estado_sensores[sid]["intensity"] = data.get('intensidad')
        buffer_descargas.append([datetime.now().strftime('%H:%M:%S'), sid, data.get('intensidad')])
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    threading.Thread(target=hilo_guardado, daemon=True).start()
    # Host 0.0.0.0 es clave para acceso desde el celular
    app.run(host='0.0.0.0', port=5000, debug=False)