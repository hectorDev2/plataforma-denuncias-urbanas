# 📢 API - Sistema de Denuncias Ciudadanas

Backend para la gestión y seguimiento de denuncias ciudadanas (baches, basura, alumbrado, etc.). Desarrollado con **NestJS** y **Prisma**.

## 🚀 Características Principales

- **Autenticación y Autorización**:
  - Registro e inicio de sesión seguro (JWT).
  - Control de acceso basado en roles (`citizen`, `authority`, `admin`).
- **Gestión de Denuncias**:
  - Creación de denuncias con ubicación (lat/lng) e imágenes.
  - Clasificación por categorías.
  - Flujo de estados: `pending` → `in_progress` → `resolved`.
- **Panel Administrativo (Dashboard)**:
  - Estadísticas globales y gráficos.
  - Métricas de usuarios y denuncias por fecha/estado.
- **Comunicación**:
  - Sistema de mensajería y notificaciones.
- **Base de Datos**:
  - ORM Prisma con SQLite (configuración por defecto).

## 🛠️ Tecnologías

- **Framework**: [NestJS](https://nestjs.com/)
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de Datos**: SQLite (Dev) / PostgreSQL (Prod compatible)
- **Autenticación**: Passport + JWT

## ⚙️ Instalación y Configuración

### 1. Requisitos previos
- Node.js (v18 o superior)
- npm

### 2. Clonar el repositorio e instalar dependencias

```bash
git clone <URL_DEL_REPOSITORIO>
cd backend-denuncias
npm install
```

### 3. Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el siguiente ejemplo:

```env
# Conexión a Base de Datos (SQLite por defecto)
DATABASE_URL="file:./dev.db"

# Secreto para firma de JWT
JWT_SECRET="tusecretoseguro"

# Puerto de la aplicación (opcional, por defecto 3000)
PORT=3000
```

### 4. Configurar la Base de Datos

Ejecuta las migraciones de Prisma para crear las tablas:

```bash
npx prisma migrate dev --name init
```

### 5. Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## 📚 Documentación de API (Endpoints Clave)

### Autenticación
- `POST /auth/login` - Iniciar sesión.
- `POST /auth/register` - Registrar nuevo usuario.

### Denuncias
- `GET /denuncias` - Listar denuncias (filtros disponibles).
- `POST /denuncias` - Crear nueva denuncia.
- `GET /denuncias/:id` - Ver detalle.
- `PATCH /denuncias/:id/status` - Actualizar estado (Admin/Autoridad).

### Estadísticas (Admin)
- `GET /stats/dashboard` - Métricas para gráficos y KPIs.

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e
```
