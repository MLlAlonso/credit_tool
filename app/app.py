from flask import Flask, request, jsonify, send_from_directory
from app.database import get_db_connection, init_db
import os
from datetime import datetime

app = Flask(__name__, static_folder='../public', static_url_path='/')

with app.app_context():
    init_db()

# --- Rutas de la API para Créditos ---

@app.route('/api/creditos', methods=['POST'])
def add_credito():
    new_credito = request.get_json()
    if not new_credito:
        return jsonify({'error': 'No se proporcionaron datos JSON'}), 400

    cliente = new_credito.get('cliente')
    monto = new_credito.get('monto')
    tasa_interes = new_credito.get('tasa_interes')
    plazo = new_credito.get('plazo')
    fecha_otorgamiento = new_credito.get('fecha_otorgamiento')

    if cliente is None or cliente == '' or \
       monto is None or \
       tasa_interes is None or \
       plazo is None or \
       fecha_otorgamiento is None or fecha_otorgamiento == '':
         return jsonify({'error': 'Faltan campos obligatorios (cliente, monto, tasa_interes, plazo, fecha_otorgamiento)'}), 400
    
    try:
        monto = float(monto)
        tasa_interes = float(tasa_interes)
        plazo = int(plazo)
        datetime.strptime(fecha_otorgamiento, '%Y-%m-%d')

    except ValueError:
        return jsonify({'error': 'Monto, tasa de interés, plazo o formato de fecha son inválidos. Asegure YYYY-MM-DD para la fecha.'}), 400
    except TypeError:
        return jsonify({'error': 'Tipos de datos incorrectos para monto, tasa de interés o plazo'}), 400

    if monto < 0:
        return jsonify({'error': 'El monto no puede ser negativo'}), 400
    if tasa_interes < 0:
        return jsonify({'error': 'La tasa de interés no puede ser negativa'}), 400
    if plazo <= 0:
        return jsonify({'error': 'El plazo debe ser un número entero positivo'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO creditos (cliente, monto, tasa_interes, plazo, fecha_otorgamiento) VALUES (?, ?, ?, ?, ?)",
            (cliente, monto, tasa_interes, plazo, fecha_otorgamiento)
        )
        conn.commit()
        credito_id = cursor.lastrowid
        cursor.execute("SELECT * FROM creditos WHERE id = ?", (credito_id,))
        inserted_credito = cursor.fetchone()
        return jsonify({
            'message': 'Crédito agregado exitosamente',
            'credito': dict(inserted_credito)
        }), 201
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({'error': f'Error al agregar crédito: {e}'}), 500
    finally:
        conn.close()

@app.route('/api/creditos', methods=['GET'])
def get_creditos():
    conn = get_db_connection()
    cursor = conn.cursor()

    # --- Lógica de Filtrado y Búsqueda ---
    search_cliente = request.args.get('cliente', '')
    min_monto = request.args.get('min_monto')
    max_monto = request.args.get('max_monto')

    query = "SELECT * FROM creditos WHERE 1=1"
    params = []

    if search_cliente:
        query += " AND cliente LIKE ?"
        params.append(f"%{search_cliente}%")

    if min_monto:
        try:
            min_monto = float(min_monto)
            query += " AND monto >= ?"
            params.append(min_monto)
        except ValueError:
            return jsonify({'error': 'min_monto debe ser un número válido'}), 400
    
    if max_monto:
        try:
            max_monto = float(max_monto)
            query += " AND monto <= ?"
            params.append(max_monto)
        except ValueError:
            return jsonify({'error': 'max_monto debe ser un número válido'}), 400

    # --- Lógica de Ordenamiento ---
    sort_by = request.args.get('sort_by', 'id')
    sort_order = request.args.get('sort_order', 'desc')

    valid_sort_columns = ['id', 'cliente', 'monto', 'tasa_interes', 'plazo', 'fecha_otorgamiento']
    if sort_by not in valid_sort_columns:
        return jsonify({'error': f'Columna de ordenamiento no válida: {sort_by}'}), 400
    
    if sort_order.lower() not in ['asc', 'desc']:
        return jsonify({'error': 'Orden de ordenamiento no válido: debe ser "asc" o "desc"'}), 400
    
    query += f" ORDER BY {sort_by} {sort_order.upper()}"


    cursor.execute(query, params)
    creditos = cursor.fetchall()
    conn.close()
    creditos_list = [dict(credito) for credito in creditos]
    return jsonify(creditos_list), 200

@app.route('/api/creditos/<int:credito_id>', methods=['PUT'])
def update_credito(credito_id):
    updated_data = request.get_json()
    if not updated_data:
        return jsonify({'error': 'No se proporcionaron datos JSON'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    set_clauses = []
    values = []
    
    if 'cliente' in updated_data:
        if updated_data['cliente'] is None or updated_data['cliente'] == '':
            return jsonify({'error': 'El cliente no puede estar vacío'}), 400
        set_clauses.append("cliente = ?")
        values.append(updated_data['cliente'])
    if 'monto' in updated_data:
        try:
            monto = float(updated_data['monto'])
            if monto < 0:
                return jsonify({'error': 'El monto no puede ser negativo'}), 400
            set_clauses.append("monto = ?")
            values.append(monto)
        except (ValueError, TypeError):
            return jsonify({'error': 'Monto debe ser un número válido'}), 400
    if 'tasa_interes' in updated_data:
        try:
            tasa_interes = float(updated_data['tasa_interes'])
            if tasa_interes < 0:
                return jsonify({'error': 'La tasa de interés no puede ser negativa'}), 400
            set_clauses.append("tasa_interes = ?")
            values.append(tasa_interes)
        except (ValueError, TypeError):
            return jsonify({'error': 'Tasa de interés debe ser un número válido'}), 400
    if 'plazo' in updated_data:
        try:
            plazo = int(plazo)
            if plazo <= 0:
                return jsonify({'error': 'El plazo debe ser un número entero positivo'}), 400
            set_clauses.append("plazo = ?")
            values.append(plazo)
        except (ValueError, TypeError):
            return jsonify({'error': 'Plazo debe ser un número entero válido'}), 400
    if 'fecha_otorgamiento' in updated_data:
        if updated_data['fecha_otorgamiento'] is None or updated_data['fecha_otorgamiento'] == '':
            return jsonify({'error': 'La fecha de otorgamiento no puede estar vacía'}), 400
        try:
            datetime.strptime(updated_data['fecha_otorgamiento'], '%Y-%m-%d')
            set_clauses.append("fecha_otorgamiento = ?")
            values.append(updated_data['fecha_otorgamiento'])
        except ValueError:
            return jsonify({'error': 'Formato de fecha de otorgamiento inválido. Asegure YYYY-MM-DD.'}), 400

    if not set_clauses:
        return jsonify({'error': 'No se proporcionaron campos válidos para actualizar'}), 400

    values.append(credito_id)

    try:
        query = f"UPDATE creditos SET {', '.join(set_clauses)} WHERE id = ?"
        cursor.execute(query, tuple(values))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({'message': 'Crédito no encontrado'}), 404
        
        cursor.execute("SELECT * FROM creditos WHERE id = ?", (credito_id,))
        updated_credito = cursor.fetchone()
        return jsonify({
            'message': 'Crédito actualizado exitosamente',
            'credito': dict(updated_credito)
        }), 200
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({'error': f'Error al actualizar crédito: {e}'}), 500
    finally:
        conn.close()

@app.route('/api/creditos/<int:credito_id>', methods=['DELETE'])
def delete_credito(credito_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM creditos WHERE id = ?", (credito_id,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({'message': 'Crédito no encontrado'}), 404
        return jsonify({'message': 'Crédito eliminado exitosamente'}), 200
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({'error': f'Error al eliminar crédito: {e}'}), 500
    finally:
        conn.close()

# --- Servir archivos estáticos del frontend ---
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/src/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(app.static_folder, 'src'), filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)