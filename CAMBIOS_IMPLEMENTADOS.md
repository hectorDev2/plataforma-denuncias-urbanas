# Sistema de Denuncias Urbanas - Cambios Implementados

## ✅ Cambios Completados

### 1. Gestión de Estados de Denuncias
- **Estados disponibles**: `pending` (pendiente), `in_progress` (en revisión), `resolved` (resuelta)
- **Almacenamiento**: Campo `estado` en la tabla `Complaint`
- **Inicio automático**: Toda denuncia se crea con estado `pending` por defecto

### 2. Backend (NestJS)

#### Controlador (denuncias.controller.ts)
- ✅ Endpoint `PATCH /denuncias/:id/status` implementado
- ✅ Validación de rol: solo `admin` o `authority` pueden cambiar estado
- ✅ DTO de actualización de estado: `UpdateStatusDto`

#### Servicio (denuncias.service.ts)
- ✅ Método `updateStatus(id, estado)` para actualizar el estado
- ✅ Validación automática de datos con ValidationPipe
- ✅ Transformación de tipos: strings a números (lat/lng) mediante Transform decorators

#### DTO (create-denuncia.dto.ts)
- ✅ `@Transform()` para convertir latitud y longitud a Float
- ✅ `@IsNumber()` con validación de errores personalizados
- ✅ Fallback de campos (español/inglés para compatibilidad)

#### Configuración (main.ts)
- ✅ Global `ValidationPipe` con `transform: true`
- ✅ `whitelist: true` para rechazar propiedades no válidas
- ✅ CORS habilitado para acceso desde frontend

### 3. Frontend (Next.js)

#### Componente DenunciaControls (components/denuncia-controls.tsx)
```tsx
// Tres botones visibles para cambiar estado
<Button onClick={() => handleStatusChange("pendiente")}>
  <Clock /> Pendiente
</Button>
<Button onClick={() => handleStatusChange("en-revision")}>
  <AlertCircle /> En Revisión
</Button>
<Button onClick={() => handleStatusChange("resuelta")}>
  <CheckCircle /> Resuelta
</Button>
```
- ✅ Mostrado solo para usuarios con rol `admin` o `autoridad`
- ✅ Botón actual resaltado (variante "default")
- ✅ Iconos visuales para cada estado
- ✅ Toast de confirmación/error

#### API (lib/denuncias-api.ts)
```typescript
export async function actualizarEstadoDenuncia(id: string | number, estado: string)
```
- ✅ Mapeo de estados frontend → backend
  - "pendiente" → "pending"
  - "en-revision" → "in_progress"
  - "resuelta" → "resolved"
- ✅ Autenticación con JWT token
- ✅ Manejo de errores

#### Mapeo de Campos (lib/api.ts)
```typescript
estadoActualizadoEn: d.estadoActualizadoEn ?? d.updatedAt ?? null
```
- ✅ Compatibilidad con campos en español/inglés
- ✅ Fallback automático si campo no existe

### 4. Base de Datos

#### Schema (prisma/schema.prisma)
```prisma
model Denuncia {
  id          Int      @id @default(autoincrement())
  titulo       String
  descripcion String
  categoria    String
  estado      String   @default("pending")
  latitud     Float?
  longitud    Float?
  direccion   String?
  urlImagen   String?
  creadoEn   DateTime @default(now())
  usuarioId      Int
  usuario        Usuario  @relation(fields: [usuarioId], references: [id])
  @@map("Complaint")
}
```

#### Migraciones
- Migración inicial: `20251222234318_init`
- Migración de campo dirección: `20251230034112_add_address_field`
- Tablas creadas: User, Complaint, Message, Notification, PasswordResetToken

### 5. Autenticación y Autorización

#### Usuario Admin
- **Email**: `admin@test.com`
- **Contraseña**: `admin123`
- **Rol**: `admin` (acceso completo)
- **Crear**: Script `create_admin_prisma.js` usando bcryptjs

#### Roles
- `citizen`: ciudadano común (crear denuncias)
- `authority`: autoridad municipal (cambiar estado, ver todas)
- `admin`: administrador (acceso total)

#### Guards
- `JwtAuthGuard`: valida token JWT en endpoints protegidos
- `RolesGuard`: valida rol del usuario para acciones específicas

## 📋 Flujo Completo de Cambio de Estado

### 1. Usuario Admin visualiza denuncia
```
GET /denuncias/:id
→ Backend retorna denuncia con estado actual
```

### 2. Admin hace clic en botón "En Revisión"
```
Frontend captura evento → Valida rol → Llamada a API
```

### 3. Frontend envía actualización
```
PATCH /denuncias/:id/status
Content-Type: application/json
Authorization: Bearer <token>
Body: { "estado": "in_progress" }
```

### 4. Backend procesa cambio
```
Controller valida rol (admin/authority)
→ Service actualiza estado en BD
→ Retorna denuncia actualizada
```

### 5. Frontend muestra confirmación
```
Toast: "Estado actualizado"
Botón correspondiente se resalta
Página se refresca
```

## 🔧 Instalación y Ejecución

### Opción 1: Scripts incluidos

**PowerShell (Windows):**
```powershell
cd plataforma-denuncias-urbanas
.\Start-App.ps1
```

**Bash (Linux/Mac):**
```bash
cd plataforma-denuncias-urbanas
bash start-app.sh
```

### Opción 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run start:dev
# Escucha en http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# Escucha en http://localhost:3000 o :3001
```

## 🧪 Pruebas

### 1. Login como Admin
- Ir a http://localhost:3000/login
- Email: `admin@test.com`
- Password: `admin123`

### 2. Ver Denuncias
- Dashboard → Ver todas las denuncias
- O crear una nueva denuncia como ciudadano

### 3. Cambiar Estado
- Abrir denuncia
- Hacer clic en botones de estado (Pendiente, En Revisión, Resuelta)
- Verificar que cambia en la BD

### 4. Verificar Autorización
- Logout
- Login como ciudadano
- Intentar cambiar estado (debe fallar - botones no visibles)

## 📝 Notas Técnicas

- **Campos bilingües**: Soporta tanto nombres en español como inglés
- **Validación automática**: Transformación de tipos en DTOs
- **Sin migraciones pendientes**: Schema sincronizado con BD
- **Base de datos**: SQLite en `backend/prisma/dev.db`
- **Variables de entorno**: Configuradas en `backend/.env`

## 🐛 Posibles Mejoras Futuras

- Agregar campo `estadoActualizadoEn` para auditoría
- Historial de cambios de estado
- Notificaciones por cambio de estado
- Comentarios/notas en cada cambio de estado
- Búsqueda y filtros avanzados
- Exportar reportes de denuncias
