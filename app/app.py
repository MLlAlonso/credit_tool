from flask import Flask, request, jsonify, send_from_directory
from app.database import get_db_connection, init_db
import os

app = Flask(__name__, static_folder='../public', static_url_path='/')

with app.app_context():
    init_db()

@app.route('/api/creditos', methods=['POST'])
def add_credito():
    """
    Ruta para registrar un nuevo crédito.
    """
    new_credito = request.get_json()
    if not new_credito:
        return jsonify({'error': 'No se proporcionaron datos JSON'}), 400

    cliente = new_credito.get('cliente')
    monto = new_credito.get('monto')
    tasa_interes = new_credito.get('tasa_interes')
    plazo = new_credito.get('plazo')
    fecha_otorgamiento = new_credito.get('fecha_otorgamiento')

    # Validaciones básicas
    if not all([cliente, monto, tasa_interes, plazo, fecha_otorgamiento]):
        return jsonify({'error': 'Todos los campos son obligatorios'}), 400
    try:
        monto = float(monto)
        tasa_interes = float(tasa_interes)
        plazo = int(plazo)
    except ValueError:
        return jsonify({'error': 'Monto, tasa de interés y plazo deben ser números válidos'}), 400

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
    """
    Listar todos los créditos.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM creditos ORDER BY id DESC")
    creditos = cursor.fetchall()
    conn.close()
    creditos_list = [dict(credito) for credito in creditos]
    return jsonify(creditos_list), 200

@app.route('/api/creditos/<int:credito_id>', methods=['PUT'])
def update_credito(credito_id):
    """
    Editar un crédito existente por su ID.
    """
    updated_data = request.get_json()
    if not updated_data:
        return jsonify({'error': 'No se proporcionaron datos JSON'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    set_clauses = []
    values = []

    if 'cliente' in updated_data:
        set_clauses.append("cliente = ?")
        values.append(updated_data['cliente'])
    if 'monto' in updated_data:
        try:
            monto = float(updated_data['monto'])
            set_clauses.append("monto = ?")
            values.append(monto)
        except ValueError:
            return jsonify({'error': 'Monto debe ser un número válido'}), 400
    if 'tasa_interes' in updated_data:
        try:
            tasa_interes = float(updated_data['tasa_interes'])
            set_clauses.append("tasa_interes = ?")
            values.append(tasa_interes)
        except ValueError:
            return jsonify({'error': 'Tasa de interés debe ser un número válido'}), 400
    if 'plazo' in updated_data:
        try:
            plazo = int(updated_data['plazo'])
            set_clauses.append("plazo = ?")
            values.append(plazo)
        except ValueError:
            return jsonify({'error': 'Plazo debe ser un número entero válido'}), 400
    if 'fecha_otorgamiento' in updated_data:
        set_clauses.append("fecha_otorgamiento = ?")
        values.append(updated_data['fecha_otorgamiento'])

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

@app.route('/')
def serve_index():
    """Sirve el archivo index.html."""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/src/<path:filename>')
def serve_static(filename):
    """Sirve otros archivos estáticos como CSS y JS desde public/src."""
    return send_from_directory(os.path.join(app.static_folder, 'src'), filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)