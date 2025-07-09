import sqlite3
import os

DB_NAME = 'creditos.db'
DB_PATH = os.path.join('app', DB_NAME)

def create_database():
    """
    Crea la base de datos SQLite y la tabla 'creditos' si no existen.
    """
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS creditos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente TEXT NOT NULL,
                monto REAL NOT NULL,
                tasa_interes REAL NOT NULL,
                plazo INTEGER NOT NULL,
                fecha_otorgamiento TEXT NOT NULL
            );
        ''')
        conn.commit()
        print(f"Base de datos '{DB_NAME}' y tabla 'creditos' creadas exitosamente en '{DB_PATH}'.")
    except sqlite3.Error as e:
        print(f"Error al crear la base de datos: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    create_database()