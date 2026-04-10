# bills-dashboard

Proyecto simple para gestionar facturas (bills) con Backend en Django REST y Frontend en React + Vite + Tailwind.

Resumen rápido
- Backend: Django + Django REST Framework en `Backend/`.
- Frontend: React + Vite + Tailwind en `Frontend/`.
- Desde la raíz hay scripts npm para arrancar front y back: `npm run start:back` y `npm run start:front`.

Requisitos
- Python 3.10+ (o equivalente instalado como `python`).
- Node.js 18+ y `npm`.

Configuración y ejecución (Windows)

1) Backend

```powershell
cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # opcional, para acceder al admin
python manage.py runserver 8000
```

2) Frontend

```powershell
cd Frontend
npm install
npm run dev
```

Opción rápida (desde la raíz, en dos terminales separadas)

```powershell
# Terminal 1
npm run start:back

# Terminal 2
npm run start:front
```

Notas sobre configuración
- El frontend asume por defecto que la API está en `http://localhost:8000/api`. Para cambiarlo, define la variable de entorno `VITE_API_BASE` antes de ejecutar Vite. Por ejemplo:

```powershell
# Windows (PowerShell)
$env:VITE_API_BASE = "http://mi-api:8000/api"
npm run dev
```

API y datos iniciales
- Endpoints principales:
  - `GET /api/tags/` — obtener tags.
  - `GET /api/bills/?month=YYYY-MM` — obtener facturas del mes (se espera `YYYY-MM`).
  - `POST /api/bills/` — crear una factura (campos: `name`, `value`, `type`, `tag_ids`, `month` donde `month` se envía como `YYYY-MM-01`).

- Antes de poder crear facturas desde el frontend, crea algunos tags. Puedes hacerlo desde el admin (ejecuta `python manage.py createsuperuser` y accede a `http://localhost:8000/admin/`) o con una petición POST a `/api/tags/`.

Ejemplo rápido (curl)

```bash
curl -X POST http://localhost:8000/api/tags/ -H "Content-Type: application/json" -d '{"name":"hogar"}'
```

Formato del mes
- El input en la UI usa `type="month"` y el frontend envía `month` como `YYYY-MM-01` al backend (fecha del primer día del mes) para filtrar facturas.

Problemas comunes
- CORS: ya está permitido para todos los orígenes en `Backend/backend/settings.py` durante desarrollo.
- Si obtienes errores al ejecutar `python`, verifica que la ruta a Python esté en `PATH`.
- Si las herramientas de Node indican scripts no encontrados, ejecuta `npm install` dentro de `Frontend/`.

Siguientes pasos sugeridos
- Crear algunos `Tag` desde el admin o API.
- Probar agregar filas desde la UI y verificar que aparezcan en la tabla del mes seleccionado.
- Implementar validaciones y paginación si la lista crece.

Archivos relevantes
- Backend: [Backend/manage.py](Backend/manage.py) y la app en [Backend/api](Backend/api).
- Frontend: [Frontend/src/App.jsx](Frontend/src/App.jsx).

Si quieres, puedo:
- crear datos de ejemplo (seed) automáticamente,
- crear un script de arranque único para iniciar front+back en desarrollo,
- o crear instrucciones específicas para Linux/macOS.
