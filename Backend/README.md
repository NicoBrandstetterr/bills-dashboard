# Backend

Setup and run:

```bash
cd Backend
python -m venv venv
venv\\Scripts\\activate       # Windows
# or: source venv/bin/activate  # macOS / Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Using MySQL (opcional):

- Instala MySQL y crea una base de datos (por ejemplo `bills_db`).
- Establece las variables de entorno antes de ejecutar el proyecto:

```bash
set MYSQL_DATABASE=bills_db
set MYSQL_USER=nicolas
set MYSQL_PASSWORD=your_password_here
set MYSQL_HOST=127.0.0.1
set MYSQL_PORT=3306
```

- Instala dependencias y aplica migraciones (ya incluimos `mysqlclient` en `requirements.txt`):

```bash
pip install -r requirements.txt
python manage.py migrate
```

Nota: la contraseña no está incluida en el repositorio; introdúcela manualmente como variable de entorno.

API endpoints:
- `GET /api/tags/`
- `GET /api/bills/?month=YYYY-MM`
- standard DRF viewset endpoints for create/update/delete