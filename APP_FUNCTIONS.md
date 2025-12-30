# Resumen de Funcionalidades — Plataforma de Denuncias Urbanas

Este documento describe de forma concisa las rutas, componentes, APIs, tipos y flujos principales implementados en la aplicación.

**Resumen general:**
- Aplicación Next.js para reportar y gestionar denuncias urbanas.
- Soporta registro/inicio de sesión, crear denuncias con foto y ubicación, listar/filtrar denuncias, vista en mapa, y panel para autoridades.

**Rutas / Páginas (carpeta `app/`)**
- `/` ([app/page.tsx]): Landing con estadísticas y listado rápido de denuncias.
- `/denuncias` ([app/denuncias/page.tsx]): Listado principal con buscador, filtros (categoría, estado), y toggle grid/map.
- `/denuncias/[id]` ([app/denuncias/[id]/page.tsx]): Detalle de una denuncia individual. (Existe la ruta en estructura).
- `/nueva-denuncia` ([app/nueva-denuncia/page.tsx]): Formulario para crear una denuncia (imagen + ubicación + categoría + descripción). Requiere autenticación.
- `/mis-denuncias` ([app/mis-denuncias/page.tsx]): Listado de denuncias del usuario autenticado.
- `/login` ([app/login/page.tsx]) y `/registro` ([app/registro/page.tsx]): Autenticación y registro.
- `/admin` y `/dashboard` ([app/admin/page.tsx], [app/dashboard/page.tsx]): Vistas administrativas / estadísticas.

**Componentes clave (carpeta `components/`)**
- `DenunciaCard` (`components/denuncia-card.tsx`): Tarjeta que muestra título, imagen, estado, categoría, fecha, dirección y autor. Soporta:
  - Props: `denuncia: Denuncia`, `showDelete?: boolean`, `showAdminControls?: boolean`, `onDelete?: ()=>void`, `onAction?: ()=>void`.
  - Acciones: eliminar denuncia (usa `eliminarDenuncia`), cambiar estado (usa `actualizarEstadoDenuncia`), y navegación al detalle.

- `DenunciasMapView` (`components/denuncias-map-view.tsx`): Vista compuesta mapa + lista. Prop: `denuncias: Denuncia[]`. Muestra marcador simulado y detalle seleccionado.

- `LocationMap` (`components/LocationMap.tsx`) y `DenunciaMapWrapper` (`components/DenunciaMapWrapper.tsx`): componentes de mapa para seleccionar/mostrar ubicación (cargados dinámicamente en formularios).

- `location-picker.tsx` / `map-component.tsx`: utilidades visuales para selección de ubicación y render de mapas.

- `denuncia-controls.tsx`: controles para acciones sobre una denuncia (posible soporte a nivel de UI).

- `navbar.tsx`, `footer.tsx` y `theme-provider.tsx`: layout y manejo de tema.

- `components/ui/*`: conjunto de componentes UI reutilizables (Button, Input, Select, Card, AlertDialog, DropdownMenu, Toast, etc.) usados por la app.

**Hooks y contexto**
- `useAuth` / `AuthProvider` (`lib/auth-context.tsx`): contexto de autenticación.
  - `login(email,password)` llama a `login` en `lib/api.ts` y guarda `access_token` en `localStorage`.
  - `register({name,email,password})` usa `api.register`.
  - `logout()` limpia token y usuario.
  - Provee `usuario`, `token`, `isAuthenticated`.

- `hooks/use-mobile.ts` y `components/ui/use-mobile.tsx`: hooks utilitarios para detectar dispositivo móvil.
- `use-toast` wrapper para notificaciones (usa `sonner`).

**APIs del cliente (carpeta `lib/`)**
- `lib/api.ts`:
  - `getDenuncias(filters?)` → Lista denuncias (adapta campos del backend a `Denuncia`).
  - `getDenunciaPorId(id)` → Obtiene detalle y adapta campos.
  - `getDenunciasPorUsuario(userId)` → Listado por usuario.
  - `register`, `login`, `getMe` → Autenticación y obtención de perfil.
  - `getDashboardStats()` → Estadísticas para dashboard.
  - Nota: `API_URL` está hardcodeado a `http://localhost:3000` en este archivo.

- `lib/denuncias-api.ts`:
  - `crearDenuncia({title,description,category,image,lat,lng,address})` → Envia `FormData` al endpoint `/denuncias`. Añade header Authorization si `access_token` en localStorage.
  - `eliminarDenuncia(id)` → DELETE `/denuncias/:id`.
  - `actualizarEstadoDenuncia(id, estado)` → PATCH `/denuncias/:id/status` (mapea estados frontend -> backend).

**Tipos** (`lib/types.ts`): `Denuncia`, `Usuario`, `Ubicacion`, `CategoriaDenuncia`, `EstadoDenuncia`, `Estadisticas`.

**Datos de referencia**
- `data/mock-data.ts`: definiciones de `categoriasConfig`, `estadosConfig` (labels, iconos, colores) usados por filtros y badges.

**Flujos principales de la aplicación**
- Crear denuncia (`/nueva-denuncia`): el usuario autenticado completa título, descripción, seleccione categoría, asigna ubicación (mapa o geolocalización) y sube una imagen. En `handleSubmit` se llama a `crearDenuncia`. En éxito redirige a `/mis-denuncias`.

- Ver y filtrar denuncias (`/denuncias`): carga `getDenuncias()`, permite búsqueda por texto, filtrado por categoría y estado, y toggle entre `grid` y `map`. `DenunciasMapView` muestra un mapa interactivo.

- Gestión para autoridades: en `DenunciaCard` se muestran controles admin si `usuario.rol === "autoridad"`. Pueden actualizar estado y eliminar denuncias.

- Autenticación: `login`/`register` → guarda `access_token` en `localStorage`; `AuthProvider` usa `getMe(token)` para obtener perfil al cargar.

**Integración con backend**
- Endpoints esperados (según llamadas en `lib/`):
  - `POST /auth/register` → registro
  - `POST /auth/login` → login (retorna `access_token`)
  - `GET /auth/me` → perfil
  - `GET /denuncias` → listado (soporta query params `status` y `category`)
  - `GET /denuncias/:id` → detalle
  - `GET /denuncias/usuario/:id` → denuncias por usuario
  - `POST /denuncias` → crear denuncia (FormData con image)
  - `DELETE /denuncias/:id` → eliminar
  - `PATCH /denuncias/:id/status` → actualizar estado
  - `GET /denuncias/stats/dashboard` → estadísticas

**API Endpoints & Specification (usado por la app)**

1. Authentication (/auth)
   - Login: `POST /auth/login`
     - Body: `{ "email": "user@example.com", "password": "password123" }`
     - Response: `{ "access_token": "eyJhbG..." }` (la app guarda esto en `localStorage` como `access_token`).
   - Register: `POST /auth/register`
     - Body: `{ "email": "...", "name": "...", "password": "..." }`
   - Get Profile: `GET /auth/me`
     - Headers: `Authorization: Bearer <token>`
     - Response: detalles del usuario (id, email, role, etc.).
   - Forgot Password: `POST /auth/forgot-password`
     - Body: `{ "email": "user@example.com" }`
     - Response: `{ "message": "If the email is valid..." }`
   - Reset Password: `POST /auth/reset-password`
     - Body: `{ "token": "TOKEN_FROM_EMAIL", "password": "newPassword123" }`

2. Complaints / Denuncias (/denuncias)
   - List All: `GET /denuncias?status=pending&category=basura`
     - Params (opcional): `status` (pending, in_progress, resolved), `category`.
     - Public access: sí.
   - Create Complaint: `POST /denuncias`
     - Headers: `Authorization: Bearer <token>` (si el usuario está autenticado)
     - Content-Type: `multipart/form-data`
     - Body (FormData): `title`, `description`, `category`, `lat`, `lng`, `address` (opt), `image` (File, opcional, max 1)
   - Get Individual: `GET /denuncias/:id`
   - List My Complaints: `GET /denuncias/usuario/:userId`
   - Update Status (Admin/Authority Only): `PATCH /denuncias/:id/status`
     - Body: `{ "status": "in_progress" }` (o `resolved`)
   - Delete: `DELETE /denuncias/:id` (User puede borrar las propias; Admin puede borrar cualquiera)

3. Admin & Stats
   - Admin Stats: `GET /stats/dashboard` (Admin only)
     - Returns: contadores globales (total denuncias, por estado, por categoría) y stats de usuarios.
   - Manage Users (Admin only):
     - `GET /users`
     - `PATCH /users/:id/role` body `{ "role": "authority" }`
     - `PATCH /users/:id/status` body `{ "status": "blocked" }`
     - `DELETE /users/:id`

**Frontend Requirements (implementadas / recomendaciones)**
- Tech Stack: Next.js + React (ya en el repo).
- Diseño: colores institucionales (azules, blancos, grises) en los componentes UI del repo.
- Componentes: formularios de Login/Register/Forgot con validación; dashboard con vistas por rol.
- Map Integration: componentes `LocationMap` / `DenunciaMapWrapper` usan Leaflet (ya incluido en componentes).

Key Logic implementado:
- JWT Handling: creado `lib/fetcher.ts` que añade `Authorization: Bearer <token>` desde `localStorage` automáticamente y intercepta respuestas `401` para limpiar token y redirigir a `/login`.
- Role Protection: `AuthProvider` (`lib/auth-context.tsx`) mapea rol del backend (`authority`) a `autoridad` y los componentes usan `usuario?.rol` para condicionales (ej. mostrar controles admin).
- Image Handling: si la imagen devuelve una ruta relativa que empieza con `/uploads`, los componentes la prefijen con `http://localhost:3000` (ahora configurado vía `NEXT_PUBLIC_API_URL` en `lib/config.ts`).

Configuración añadida:
- `lib/config.ts`: variable `API_URL` ahora viene de `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'`.
- `lib/fetcher.ts`: helper central para peticiones API con manejo de token/401.

Flujo de contraseña olvidada:
- Usuario solicita reset en `/forgot-password` (POST `/auth/forgot-password`).
- Backend envía email con link `/reset-password?token=XYZ`.
- Usuario accede y hace `POST /auth/reset-password` con `{ token, password }`.

Si quieres, puedo:
- Añadir una página `/forgot-password` y `/reset-password` con el flujo completo.
- Forzar protección de rutas `/admin` con redirección basada en `usuario.rol`.
- Añadir validación de tamaño de imagen en cliente (p. ej. 5MB max) antes de subir.


**Variables de entorno y configuración**
- Actualmente `lib/api.ts` usa `API_URL` constante. Para despliegue es recomendable reemplazarlo por `process.env.NEXT_PUBLIC_API_URL` o similar.
- Token: la app espera `access_token` en `localStorage` para acciones autenticadas.

**Cómo probar localmente (resumen)**
1. Instalar dependencias: `bun install` (o `pnpm install` según su entorno).
2. Configurar variable `API_URL` o modificar `lib/api.ts` hacia el backend correcto.
3. Ejecutar: `bun run dev`.
4. Abrir `http://localhost:3000`.

**Notas y recomendaciones**
- Mejorar: mover `API_URL` a variables de entorno, manejo centralizado de errores, validaciones y límites de tamaño de imagen en cliente.
- Considerar usar un proveedor de mapas real (Leaflet/Mapbox) en lugar de representaciones simuladas en `DenunciasMapView`.
- Añadir tests para `lib/` y componentes clave.

---
Archivo generado automáticamente como guía de referencia de la aplicación. Si quieres, puedo:
- Actualizar el `README.md` con un resumen y enlace a este documento (puedo hacerlo ahora).
- Reemplazar `API_URL` por `process.env.NEXT_PUBLIC_API_URL` y agregar instrucciones de `.env`.
- Generar documentación más detallada por componente (props, ejemplos).

¿Qué quieres que haga a continuación? (p. ej. actualizar `README.md`, cambiar `API_URL`, o generar docs por componente).