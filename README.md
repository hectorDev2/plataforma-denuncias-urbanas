# Plataforma de Denuncias Urbanas

## Descripción

Esta es una aplicación web para la gestión de denuncias urbanas, desarrollada con Next.js y otras tecnologías modernas. Permite a los usuarios reportar incidentes en la ciudad, y a los administradores gestionarlos eficientemente.

## Características

- Creación y seguimiento de denuncias.
- Visualización de denuncias en un mapa.
- Autenticación de usuarios.
- Panel de administración.

## Tecnologías Utilizadas

- Next.js
- React
- Tailwind CSS
- Bun (gestor de paquetes)

## Configuración del Proyecto

Para configurar y ejecutar el proyecto localmente, sigue estos pasos:

### Prerrequisitos

Asegúrate de tener instalado `bun` en tu sistema.

### Instalación

1. Clona el repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd plataforma-denuncias-urbanas
   ```

2. Instala las dependencias:

   ```bash
   bun install
   ```

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto y añade las siguientes variables de entorno:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

(Añade aquí cualquier otra variable de entorno necesaria para la base de datos o servicios externos).

### Ejecutar el Servidor de Desarrollo

```bash
bun run dev
```

La aplicación estará disponible en `http://localhost:3000`.

Más información y documentación de la aplicación (rutas, componentes y APIs): [APP_FUNCTIONS.md](APP_FUNCTIONS.md)