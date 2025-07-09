import sqlite3
import os

DATABASE = os.path.join(os.path.dirname(__file__), 'creditos.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row 
    return conn

def init_db():
    """
    Inicializa la base de datos
    """
    conn = get_db_connection()
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
    conn.close()

if __name__ == '__main__':
    init_db()
    print(f"Base de datos {DATABASE} inicializada.")