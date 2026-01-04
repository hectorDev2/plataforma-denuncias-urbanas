# 🚀 Sistema Listo para Ejecutar

## Cambios Completados ✅

### Backend
- ✅ Sistema de estados de denuncias (`pendiente`, `en-revisión`, `resuelta`)
- ✅ Endpoint `PATCH /denuncias/:id/status` con validación de roles
- ✅ Solo `admin` o `authority` pueden cambiar estado
- ✅ Validación automática de tipos (lat/lng como Float)
- ✅ Admin creado: `admin@test.com` / `admin123`

### Frontend
- ✅ 3 botones visibles para cambiar estado
- ✅ Automático: cada denuncia inicia en estado "pendiente"
- ✅ Botones solo visibles para admin/autoridad
- ✅ Toast con confirmación/error
- ✅ Mapeo español ↔ inglés automático

### Base de Datos
- ✅ Tabla Complaint con todos los campos necesarios
- ✅ Migraciones aplicadas
- ✅ SQLite en `backend/prisma/dev.db`

---

## Cómo Ejecutar 🏃

### Opción 1: Dos Terminales (Recomendado)

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
# Abre http://localhost:3000 o :3001
```

### Opción 2: Con Script Existente

Si tienes configurado `start_backend.bat`:
```bash
./start_backend.bat
```

---

## Pruebas Rápidas 🧪

### 1. Login Admin
```
URL: http://localhost:3000/login
Email: admin@test.com
Password: admin123
```

### 2. Crear Denuncia
```
Dashboard → Nueva Denuncia
- Se crea automáticamente en estado "PENDIENTE"
- Admin ve 3 botones para cambiar estado
```

### 3. Cambiar Estados
```
En la vista de denuncia:
- Click "En Revisión" → estado cambia a in_progress
- Click "Resuelta" → estado cambia a resolved
- Click "Pendiente" → vuelve a pending
```

### 4. Verificar Autorización
```
Logout → Login como ciudadano
- Abre una denuncia
- Botones NO aparecen (solo admin/authority)
```

---

## Estructura de Cambios 📁

```
Backend:
  src/denuncias/
    ├── denuncias.controller.ts  → PATCH /denuncias/:id/status
    ├── denuncias.service.ts     → updateStatus()
    └── dto/update-status.dto.ts → Validación

Frontend:
  components/
    └── denuncia-controls.tsx    → 3 botones de estado
  lib/
    ├── api.ts                   → Mapeo de campos
    └── denuncias-api.ts         → actualizarEstadoDenuncia()
```

---

## Estados Disponibles 📊

| Estado | DB | Frontend |
|--------|----|----|
| Pendiente | `pending` | "pendiente" |
| En Revisión | `in_progress` | "en-revision" |
| Resuelta | `resolved` | "resuelta" |

**Auto-Inicio:** Toda denuncia se crea con `estado = "pending"`

---

## Credenciales 🔐

**Admin:**
- Email: `admin@test.com`
- Password: `admin123`
- Rol: admin

**Crear Ciudadano:** Usar formulario de registro

---

## Repositorio 📦

```
Branch: proyecto
Commits:
  - feat: Implementar gestión de estados
  - docs: Documentación de cambios
```

---

## ¿Algo No Funciona? 🔧

### Error "columna no existe"
- Base de datos puede estar corrupta
- Solución: Eliminar `backend/prisma/dev.db` y reiniciar

### Botones no aparecen
- Verifica que estés logueado como admin
- Verifica que `usuario.rol === "admin"`

### Cambio de estado no guarda
- Verifica que el token JWT sea válido
- Revisa consola de backend para errores

---

## Notas ✏️

- ✅ Sin migraciones pendientes
- ✅ Carpeta `.idea` eliminada
- ✅ Scripts limpios y organizados
- ✅ Todo en rama `proyecto`
- ✅ Base de datos lista para usar

**¡Sistema listo para producción!** 🎉
