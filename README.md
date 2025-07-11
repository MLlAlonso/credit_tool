# 📊 Herramienta de Registro y Visualización de Créditos

Proyecto web desarrollado con **Python Flask** en el backend y **HTML, SCSS, JavaScript (modular)** en el frontend, que permite registrar, gestionar y visualizar información sobre créditos otorgados. Los datos se almacenan en una base de datos **SQLite**.

---

## 🚀 Características Principales

- **Operaciones CRUD Completas**:
    - **Crear**: Registrar nuevos créditos.
    - **Leer**: Listar todos los créditos en una tabla dinámica.
    - **Actualizar**: Editar créditos existentes directamente desde la tabla.
    - **Eliminar**: Borrar créditos con confirmación.
- **Filtrado y Búsqueda**: Filtra créditos por nombre de cliente, monto mínimo y máximo.
- **Ordenamiento de Tabla**: Ordena la lista de créditos haciendo clic en los encabezados de las columnas.
- **Cálculo de Pagos Mensuales**: Visualiza el pago mensual estimado para cada crédito.
- **Visualización de Datos**: Gráfico interactivo (Chart.js) para la distribución de montos otorgados.
- **Validaciones Robustas**: Validaciones en frontend y backend para asegurar la integridad de los datos.
- **Diseño Responsivo**: Interfaz adaptada a diferentes tamaños de pantalla.
- **Estructura de Código Modular**:
    - **Backend (Flask)**: API RESTful separada de la lógica de base de datos.
    - **Frontend (JavaScript)**: Código organizado en módulos (`api.js`, `dom_elements.js`, `form_handler.js`, `table_renderer.js`, `chart_manager.js`, `utils.js`, `main.js`).
    - **Estilos (SCSS)**: Metodología **BEM** para CSS escalable y entendible.

---

## 🛠️ Tecnologías Utilizadas

- **Backend**:
    - [Python 3](https://www.python.org/)
    - [Flask](https://flask.palletsprojects.com/)
    - [SQLite3](https://www.sqlite.org/index.html)
- **Frontend**:
    - [HTML5](https://developer.mozilla.org/es/docs/Web/HTML)
    - [SCSS (Sass)](https://sass-lang.com/)
    - [JavaScript ES6+](https://developer.mozilla.org/es/docs/Web/JavaScript)
    - [Chart.js](https://www.chartjs.org/)

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- [Python 3.8+](https://www.python.org/downloads/)
- [npm](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)

---

## 📦 Instalación y Ejecución

1. **Clona el Repositorio:**
     ```bash
     git clone https://github.com/tu_usuario/nombre_del_repositorio.git
     cd nombre_del_repositorio
     ```

2. **Crea y Activa un Entorno Virtual (Recomendado):**
     ```bash
     python -m venv venv
     # En Windows (PowerShell):
     .\venv\Scripts\Activate
     # En Windows (CMD):
     .\venv\Scripts\activate.bat
     # En Linux / macOS:
     source venv/bin/activate
     ```

3. **Instala las Dependencias de Python:**
     ```bash
     pip install -r requirements.txt
     ```
     > Si aún no tienes `requirements.txt`, puedes generarlo ejecutando `pip freeze > requirements.txt` después de instalar Flask (`pip install Flask`).

4. **Crea la Base de Datos SQLite:**
     ```bash
     python create_db.py
     ```
     > Este script creará el archivo `creditos.db` y la tabla `creditos` dentro de la carpeta `app/`.

5. **Compila el SCSS a CSS:**
     ```bash
     cd public/src/css/
     sass --watch style.scss style.css
     ```
     > Necesitas tener `sass` instalado globalmente (`npm install -g sass`). Deja esta terminal abierta para recompilación automática.

6. **Inicia la Aplicación Flask:**
     Abre una **nueva terminal**, activa tu entorno virtual y ejecuta la aplicación desde la **raíz del proyecto**:
     ```bash
     # Windows (PowerShell):
     $env:FLASK_APP = "app/app.py"
     flask run

     # Windows (CMD):
     set FLASK_APP=app/app.py
     flask run

     # Linux / macOS:
     export FLASK_APP=app/app.py
     flask run
     ```
     La aplicación se ejecutará en `http://127.0.0.1:5000/`.

7. **Accede a la Aplicación:**
     Abre tu navegador y ve a `http://localhost:5000/`.

---

## 🧪 Pruebas de la API (Postman/Insomnia)

- **Registrar Crédito (POST)**
    - **URL**: `http://127.0.0.1:5000/api/creditos`
    - **Método**: `POST`
    - **Headers**: `Content-Type: application/json`
    - **Body (JSON)**:
        ```json
        {
            "cliente": "Mikkel Llaven",
            "monto": 25000.75,
            "tasa_interes": 0.05,
            "plazo": 12,
            "fecha_otorgamiento": "2025-07-13"
        }
        ```
- **Listar Créditos (GET)**
    - **URL**: `http://127.0.0.1:5000/api/creditos`
    - **Método**: `GET`
    - **Parámetros opcionales**: `?cliente=Maria&min_monto=10000&max_monto=30000&sort_by=monto&sort_order=asc`
- **Actualizar Crédito (PUT)**
    - **URL**: `http://127.0.0.1:5000/api/creditos/{id_del_credito}`
    - **Método**: `PUT`
    - **Headers**: `Content-Type: application/json`
    - **Body (JSON)**:
        ```json
        {
            "monto": 26000.00,
            "plazo": 18
        }
        ```
- **Eliminar Crédito (DELETE)**
    - **URL**: `http://127.0.0.1:5000/api/creditos/{id_del_credito}`
    - **Método**: `DELETE`

---

## 📚 Estructura del Proyecto

```
credit_tool/
├── app/
│   ├── app.py              # Lógica backend Flask y rutas de la API
│   └── database.py         # Funciones para conexión a SQLite
├── public/
│   ├── src/
│   │   ├── css/
│   │   │   └── style.scss  # Estilos SCSS (compila a style.css)
│   │   └── js/
│   │       ├── modules/    # Módulos JavaScript
│   │       │   ├── api.js
│   │       │   ├── chart_manager.js
│   │       │   ├── dom_elements.js
│   │       │   ├── form_handler.js
│   │       │   ├── table_renderer.js
│   │       │   └── utils.js
│   │       └── main.js     # Lógica principal frontend
│   └── index.html          # Interfaz de usuario principal
├── create_db.py            # Script para inicializar la base de datos
└── requirements.txt        # Dependencias de Python
```