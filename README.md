# 📊 Herramienta de Registro y Visualización de Créditos

¡Bienvenido/a a la Herramienta de Registro y Visualización de Créditos! Este es un proyecto web desarrollado con **Python Flask** en el backend y **HTML, SCSS, JavaScript (modular)** en el frontend, que permite registrar, gestionar y visualizar información sobre créditos otorgados. Los datos se almacenan en una base de datos **SQLite**.

---

## 🚀 Características Principales

* **Registro de Créditos**: Formulario intuitivo para añadir nuevos créditos con campos como cliente, monto, tasa de interés, plazo y fecha de otorgamiento.
* **Operaciones CRUD Completas**:
    * **Crear**: Registrar nuevos créditos.
    * **Leer**: Listar todos los créditos en una tabla dinámica.
    * **Actualizar**: Editar créditos existentes directamente desde la tabla.
    * **Eliminar**: Borrar créditos con confirmación.
* **Filtrado y Búsqueda**: Filtra créditos por nombre de cliente, monto mínimo y monto máximo para una búsqueda eficiente.
* **Ordenamiento de Tabla**: Ordena la lista de créditos haciendo clic en los encabezados de las columnas (ID, Cliente, Monto, etc.).
* **Cálculo de Pagos Mensuales**: Visualiza el pago mensual estimado para cada crédito directamente en la tabla.
* **Visualización de Datos**: Un gráfico interactivo (Chart.js) muestra la distribución de los montos de crédito otorgados, proporcionando un resumen visual rápido.
* **Validaciones Robustas**: Validaciones en frontend y backend para asegurar la integridad de los datos (tipos correctos, valores no negativos, formatos de fecha).
* **Diseño Responsivo**: Interfaz adaptada para diferentes tamaños de pantalla.
* **Estructura de Código Modular**:
    * **Backend (Flask)**: API RESTful limpia y separada de la lógica de base de datos.
    * **Frontend (JavaScript)**: Código organizado en módulos (`api.js`, `dom_elements.js`, `form_handler.js`, `table_renderer.js`, `chart_manager.js`, `utils.js`, `main.js`) para una mejor separación de responsabilidades y mantenibilidad.
    * **Estilos (SCSS)**: Implementación de la metodología **BEM** (Block, Element, Modifier) para un CSS escalable y fácil de entender.

---

## 🛠️ Tecnologías Utilizadas

* **Backend**:
    * [Python 3](https://www.python.org/)
    * [Flask](https://flask.palletsprojects.com/) (Framework web)
    * [SQLite3](https://www.sqlite.org/index.html) (Base de datos ligera)
* **Frontend**:
    * [HTML5](https://developer.mozilla.org/es/docs/Web/HTML)
    * [SCSS (Sass)](https://sass-lang.com/) (Preprocesador CSS)
    * [JavaScript ES6+](https://developer.mozilla.org/es/docs/Web/JavaScript)
    * [Chart.js](https://www.chartjs.org/) (Librería de gráficos)

---

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente:

* [Python 3.8+](https://www.python.org/downloads/)
* [npm](https://nodejs.org/en/download/) (Node Package Manager, necesario para compilar SCSS)
* [Git](https://git-scm.com/downloads) (Para clonar el repositorio)

---

## 📦 Instalación y Ejecución

Sigue estos pasos para poner en marcha el proyecto:

1.  **Clona el Repositorio:**
    ```bash
    git clone [https://github.com/tu_usuario/nombre_del_repositorio.git]
    cd nombre_del_repositorio
    ```

2.  **Crea y Activa un Entorno Virtual (Recomendado):**
    ```bash
    python -m venv venv
    # En Windows (PowerShell):
    .\venv\Scripts\Activate
    # En Windows (CMD):
    .\venv\Scripts\activate.bat
    # En Linux / macOS:
    source venv/bin/activate
    ```

3.  **Instala las Dependencias de Python:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Si aún no tienes `requirements.txt`, puedes generarlo ejecutando `pip freeze > requirements.txt` después de instalar Flask (`pip install Flask`)).*

4.  **Crea la Base de Datos SQLite:**
    Este script creará el archivo `creditos.db` y la tabla `creditos` dentro de la carpeta `app/`.
    ```bash
    python create_db.py
    ```

5.  **Compila el SCSS a CSS:**
    Necesitas tener `sass` instalado globalmente (`npm install -g sass`).
    ```bash
    cd public/src/css/
    sass --watch style.scss style.css
    ```
    Deja esta terminal abierta, ya que `sass --watch` recompilará automáticamente el CSS cada vez que guardes cambios en `style.scss`.

6.  **Inicia la Aplicación Flask:**
    Abre una **nueva terminal** (mantén la anterior para SASS), activa tu entorno virtual y ejecuta la aplicación desde la **raíz del proyecto**:
    ```bash
    # Asegúrate de estar en la raíz del proyecto (credit_tool/)
    # Activa el entorno virtual (ver paso 2)

    # Para Windows (PowerShell):
    $env:FLASK_APP = "app/app.py"
    flask run

    # Para Windows (CMD):
    # set FLASK_APP=app/app.py
    # flask run

    # Para Linux / macOS:
    # export FLASK_APP=app/app.py
    # flask run
    ```
    La aplicación se ejecutará en `http://127.0.0.1:5000/`.

7.  **Accede a la Aplicación:**
    Abre tu navegador web y ve a `http://localhost:5000/`.

---

## 🧪 Pruebas de la API (con Postman/Insomnia)
Mientras el servidor Flask esté corriendo, puedes probar los endpoints de la API:

* **Registrar Crédito (POST)**
    * **URL**: `http://127.0.0.1:5000/api/creditos`
    * **Método**: `POST`
    * **Headers**: `Content-Type: application/json`
    * **Body (JSON)**:
        ```json
        {
            "cliente": "Maria Gomez",
            "monto": 25000.75,
            "tasa_interes": 0.05,
            "plazo": 12,
            "fecha_otorgamiento": "2024-06-20"
        }
        ```
* **Listar Créditos (GET)**
    * **URL**: `http://127.0.0.1:5000/api/creditos`
    * **Método**: `GET`
    * **Parámetros de consulta opcionales**: `?cliente=Maria&min_monto=10000&max_monto=30000&sort_by=monto&sort_order=asc`
* **Actualizar Crédito (PUT)**
    * **URL**: `http://127.0.0.1:5000/api/creditos/{id_del_credito}`
    * **Método**: `PUT`
    * **Headers**: `Content-Type: application/json`
    * **Body (JSON)**:
        ```json
        {
            "monto": 26000.00,
            "plazo": 18
        }
        ```
* **Eliminar Crédito (DELETE)**
    * **URL**: `http://127.0.0.1:5000/api/creditos/{id_del_credito}`
    * **Método**: `DELETE`

---

## 📚 Estructura del Proyecto
credit_tool/
├── app/
│   ├── app.py              # Lógica del backend Flask y rutas de la API.
│   └── database.py         # Funciones para la conexión a SQLite.
├── public/
│   ├── src/
│   │   ├── css/
│   │   │   └── style.scss  # Estilos con SCSS (compila a style.css).
│   │   └── js/
│   │       ├── modules/    # Módulos JavaScript para separación de responsabilidades.
│   │       │   ├── api.js
│   │       │   ├── chart_manager.js
│   │       │   ├── dom_elements.js
│   │       │   ├── form_handler.js
│   │       │   ├── table_renderer.js
│   │       │   └── utils.js
│   │       └── main.js     # Lógica principal del frontend (orquestación).
│   └── index.html          # Interfaz de usuario principal.
├── create_db.py            # Script para inicializar la base de datos y tablas.
└── requirements.txt        # Dependencias de Python.

---
## 🤝 Contribuciones
Siéntete libre de clonar, modificar y mejorar este proyecto. ¡Cualquier sugerencia es bienvenida!
---
## 📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
---