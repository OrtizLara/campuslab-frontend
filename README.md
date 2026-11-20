# CampusLab — Banco de Proyectos Académicos

CampusLab es una plataforma web desarrollada para dar visibilidad a los proyectos realizados por estudiantes de instituciones de formación superior.

Permite que los docentes registren los trabajos de sus cursadas, asociando estudiantes, tecnologías y archivos. Las instituciones pueden revisar los proyectos y aprobar su publicación en un catálogo público.

El proyecto se desarrolló como parte de las materias Desarrollo de Sistemas Web — Frontend y Backend.

## Tecnologías utilizadas

**Frontend**
- React
- JavaScript
- Vite
- Bootstrap
- CSS

**Backend**
- Python
- Django
- Django Ninja
- API REST
- Autenticación JWT

## Requisitos previos

Para ejecutar el proyecto es necesario tener instalado:

- Git
- Node.js y npm
- Python
- Visual Studio Code (recomendado)

También se necesita acceso a los repositorios de frontend y backend.

## 1. Descargar los repositorios

Abrir una terminal y clonar ambos proyectos:

**Frontend**

```bash
git clone https://github.com/OrtizLara/campuslab-frontend.git
```

**Backend**

```bash
git clone https://github.com/ioanne/CampusLab.git
```

Cada proyecto debe mantenerse en su propia carpeta.

## 2. Levantar el backend

Abrir una terminal dentro de la carpeta del backend:

```bash
cd CampusLab
```

### Crear el entorno virtual

En Mac o Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

En Windows (PowerShell):

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### Instalar dependencias

```bash
python -m pip install -r requirements.txt
```

### Configurar variables de entorno

Si el proyecto cuenta con un archivo `.env.example`, crear una copia llamada `.env`.

En Mac o Linux:

```bash
cp .env.example .env
```

En Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Revisar las variables de configuración de Django y de la base de datos según el entorno utilizado.

No subir contraseñas, claves secretas ni el archivo `.env` a GitHub.

### Aplicar migraciones

Con la base de datos local configurada:

```bash
python manage.py migrate
```

### Ejecutar el servidor

```bash
python manage.py runserver 8000
```

El backend quedará disponible en:

http://127.0.0.1:8000

La documentación de la API puede consultarse en:

http://127.0.0.1:8000/api/docs

Para verificar que funciona:

http://127.0.0.1:8000/api/health

**Nota:** si el backend utiliza otro puerto, deberá modificarse la URL configurada en el frontend.

## 3. Levantar el frontend

Abrir otra terminal dentro de la carpeta del frontend.

```bash
cd campuslab-frontend
```

### Instalar dependencias

```bash
npm install
```

### Configurar variables de entorno

Crear el archivo `.env` a partir de `.env.example`:

Mac o Linux:

```bash
cp .env.example .env
```

Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Verificar que contenga:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Ejecutar la aplicación

```bash
npm run dev
```

Abrir en el navegador la URL indicada por Vite, normalmente:

http://127.0.0.1:5173

## 4. Conexión entre frontend y backend

El frontend consume los endpoints de la API de Django mediante peticiones HTTP.

Algunas rutas utilizadas son:

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/projects` | Consultar el catálogo público |
| GET | `/api/projects/{slug}` | Consultar el detalle de un proyecto |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Obtener los datos del usuario |
| GET | `/api/teacher/courses` | Consultar las cursadas del docente |
| GET | `/api/teacher/projects` | Consultar los proyectos del docente |
| POST | `/api/teacher/projects` | Crear un proyecto |
| PATCH | `/api/teacher/projects/{project_id}` | Editar un proyecto |

Para permitir la comunicación entre ambos servidores, Django debe tener habilitado CORS para el origen desde el que se ejecuta React, por ejemplo:

```python
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]
```

Esta configuración requiere que `django-cors-headers` esté instalado y correctamente incorporado a las aplicaciones y middlewares de Django.

## 5. Ejecutar CampusLab en modo presentación

El frontend incluye un modo de presentación que permite recorrer las funcionalidades principales sin depender de usuarios registrados en la base de datos local.

Para utilizarlo:

1. Levantar el frontend con `npm run dev`.
2. Abrir CampusLab en el navegador.
3. Ingresar a la sección de acceso.
4. Seleccionar un rol de demostración.
5. Recorrer las pantallas disponibles.

El modo presentación permite visualizar ejemplos académicos y simular operaciones de gestión.

**Los cambios realizados en este modo no se envían al backend.** Se utilizan datos locales únicamente para demostrar el funcionamiento de la interfaz.

## 6. Roles del sistema

CampusLab contempla tres roles:

| Rol | Funcionalidades |
|---|---|
| ADMIN | Administración general del sistema |
| INSTITUTION | Gestión institucional y revisión de proyectos |
| TEACHER | Gestión de cursadas, alumnos y proyectos |

Los estudiantes no tienen una cuenta propia. Son registrados por los docentes como integrantes de las cursadas y proyectos.

## 7. Funcionalidades principales

- Catálogo público de proyectos académicos.
- Búsqueda y filtros de proyectos.
- Visualización del detalle de cada proyecto.
- Inicio de sesión mediante JWT.
- Paneles diferenciados por rol.
- Gestión de proyectos del docente.
- Selección de cursadas, integrantes y tecnologías.
- Carga de imágenes y documentos.
- Revisión institucional de proyectos.

Algunas funcionalidades se encuentran en desarrollo o pendientes de validación completa con el backend.

## 8. Estados de los proyectos

Los proyectos pueden encontrarse en los siguientes estados:

| Estado | Descripción |
|---|---|
| PENDING | Pendiente de aprobación |
| APPROVED | Aprobado |
| CHANGES | Se solicitaron modificaciones |
| REJECTED | Rechazado |

Únicamente los proyectos aprobados aparecen en el catálogo público.

## 9. Problemas frecuentes

**El frontend no se conecta con Django**

Verificar que el servidor de Django esté ejecutándose y que `VITE_API_URL` tenga la dirección correcta.

También comprobar la configuración CORS del backend.

**El login devuelve credenciales inválidas**

Verificar que el usuario exista en la base de datos local, esté activo y tenga la contraseña correcta.

Los usuarios de otros entornos no se crean automáticamente al ejecutar las migraciones.

**No aparecen proyectos en el catálogo**

El catálogo público únicamente muestra proyectos aprobados. Si todavía no existen proyectos con ese estado, el listado puede estar vacío.

**Un docente no puede crear proyectos**

Comprobar que el docente esté vinculado a una institución mediante una membresía aceptada y que tenga acceso a la cursada correspondiente.

**El puerto ya está ocupado**

Cerrar el servidor que esté utilizando ese puerto o configurar otro y actualizar las URLs necesarias.

## 10. Detener los servidores

Para detener cualquiera de los servidores, volver a su terminal y presionar:

`Ctrl + C`

---

## Estado del proyecto

CampusLab se encuentra en desarrollo como proyecto académico.

El frontend cuenta con una versión de presentación y una integración con los endpoints del backend. Las funcionalidades se completarán y validarán progresivamente.

El objetivo principal es ofrecer un espacio común para consultar, organizar y dar visibilidad a los trabajos desarrollados por estudiantes de diferentes instituciones y carreras.