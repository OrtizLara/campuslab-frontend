# CampusLab – Frontend React MVP

Frontend para el **Banco de Proyectos Académicos**. Conecta con el backend Django de CampusLab. No contiene proyectos ficticios ni credenciales precargadas.

## Requisitos
- Node.js 20.19+ o 22+
- Backend Django funcionando (por defecto `http://127.0.0.1:8000`)

## Ejecutar

```bash
npm install
cp .env.example .env
npm run dev
```

Abrí **http://127.0.0.1:5173**. Para compilar: `npm run build`.

## Conexión con Django

`VITE_API_URL` debe tener la URL base del backend **sin `/api`**. Ejemplo: `VITE_API_URL=http://127.0.0.1:8000`.

Si Chrome muestra **CORS error / OPTIONS 405**, es un problema del backend: el navegador necesita que Django responda al preflight y permita el origen `http://127.0.0.1:5173`. En Django, para `django-cors-headers`, revisá `INSTALLED_APPS`, `CorsMiddleware` y `CORS_ALLOWED_ORIGINS`. Coordinar cualquier cambio de backend con el equipo; no habilitar indiscriminadamente todos los orígenes.

## Pantallas
- `/`: presentación y destacados **reales**
- `/proyectos`: catálogo público, búsqueda y filtros
- `/proyectos/:slug`: ficha de proyecto
- `/login`: login JWT, consulta `/api/auth/me`
- `/docente`: cursadas y resumen
- `/docente/proyectos`: listado y eliminación
- `/docente/proyectos/nuevo`: alta
- `/docente/proyectos/:id/editar`: edición y subida de archivos
- `/institucion`: lista de proyectos y aprobación básica (ver pendientes)
- `/administracion`: página inicial del rol de administración, sin CRUD sin documentar

## API consumida
- `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/projects`, `GET /api/projects/{slug}`
- `GET /api/technologies`
- `GET /api/teacher/courses`, `GET /api/teacher/courses/{course_id}/students`
- `GET/POST /api/teacher/projects`, `GET/PATCH/DELETE /api/teacher/projects/{project_id}`
- `POST /api/teacher/projects/{project_id}/assets` (`FormData`, sin Content-Type manual)
- `GET /api/institution/projects`, `POST /api/institution/projects/{project_id}/approve`

## Aspectos que requieren verificación con el backend
1. `asset_type`: en el formulario usamos `IMAGE` y `DOCUMENT` como valores de ejemplo. Confirmar los valores exactos con Swagger/schema antes de probar.
2. `kind`: exponemos `CLASS_WORK`, que sí aparece como valor por defecto del POST. Confirmar otros tipos antes de incorporarlos.
3. Panel institucional: para `reject` y `request-changes` necesitamos el esquema real del cuerpo. No se enviarán datos inventados.
4. La API de listado devuelve un array según Swagger, sin paginación documentada.
5. El endpoint `GET /api/teacher/projects` se presenta con los campos del listado; si alguna propiedad es distinta, adaptar la tabla en `src/pages/TeacherProjects.jsx`.
6. El backend puede invalidar el token por expiración; actualmente se solicita volver a iniciar sesión. Renovación automática con `/api/auth/refresh` es una mejora futura.
7. La carga de imágenes y documentos se hace **después** de crear un proyecto, ya que requiere `project_id`.
8. Si una cuenta tiene privilegios específicos para publicar sin revisión, la autorización y cambio de estado se aplican en Django, no en el frontend.

## GitHub
Si ya clonaste un repositorio vacío, copiá **el contenido** de esta carpeta dentro del repositorio, no una carpeta anidada. Luego:

```bash
git add .
git commit -m "Agregar MVP React CampusLab"
git push origin main
```

No subir `.env`, tokens ni contraseñas.
