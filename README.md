# Lules Market

Bienvenido al repositorio de **Lules Market**. Esta guía está diseñada para ayudar a los nuevos desarrolladores a configurar el entorno de desarrollo desde cero de manera rápida y eficiente.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado el siguiente software en tu sistema:

- **Node.js**: Se recomienda la versión LTS (v20 o superior) o v18 como mínimo.
- **pnpm**: Utilizamos `pnpm` como gestor de paquetes por su rapidez y eficiencia.
- **Docker** y **Docker Compose**: Necesarios para ejecutar la base de datos PostgreSQL localmente.
- **Git**: Para el control de versiones.

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para poner en marcha el proyecto:

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Lules-Market
```

### 2. Instalar dependencias

Instala todas las librerías necesarias del proyecto:

```bash
pnpm install
```

### 3. Configuración de Variables de Entorno

El proyecto requiere varias variables de entorno para funcionar correctamente (base de datos, autenticación, servicios AWS, etc.).

1.  Crea un archivo llamado `.env` en la raíz del proyecto.
2.  Copia y configura las siguientes variables (basado en `env.ts`):

```env
# --- Aplicación ---
APP_URL=http://localhost:3000

# --- Base de Datos (PostgreSQL) ---
# Coincide con la configuración de docker-compose.yml
DATABASE_URL=postgres://postgres:postgres@localhost:5432/lulesmarket-db

# --- Autenticación (Better Auth) ---
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=genera_un_string_largo_y_seguro_aqui

# --- AWS S3 (Almacenamiento de Archivos) ---
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
S3_BUCKET_NAME=lules-market
# Si usas AWS real, usa las URLs de AWS. Si usas MinIO local u otro, ajusta aquí.
AWS_ENDPOINT_URL_S3=https://s3.us-east-1.amazonaws.com 
AWS_ENDPOINT_URL_IAM=https://iam.amazonaws.com

# --- Pagos (Mercado Pago) ---
MP_WEBHOOK_SECRET=tu_mp_webhook_secret
MP_ACCESS_TOKEN=tu_mp_access_token

# --- Tareas Programadas ---
CRON_SECRET=secreto_para_cron_jobs

# --- Configuración Inicial (Seed) ---
ADMIN_EMAIL=admin@lulesmarket.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User

SUPER_ADMIN_EMAIL=super@lulesmarket.com
SUPER_ADMIN_PASSWORD=super123
SUPER_ADMIN_NAME=Super Admin

# --- Correo (Nodemailer) ---
EMAIL_FROM="Lules Market <no-reply@lulesmarket.com>"
EMAIL_USER=tu_smtp_user
EMAIL_PASS=tu_smtp_password
```

### 4. Configurar la Base de Datos

Utilizamos Docker para correr PostgreSQL sin necesidad de instalarlo directamente en tu sistema operativo.

1.  **Levantar la base de datos:**
    ```bash
    docker-compose up -d
    ```
    Esto iniciará un contenedor con PostgreSQL en el puerto 5432.

2.  **Generar y Aplicar Migraciones:**
    Utilizamos Drizzle ORM para gestionar el esquema de la base de datos.
    ```bash
    # Sincronizar la BD con el esquema actual
    pnpm db:migrate
    ```

3.  **Poblar la base de datos (Seed):**
    Carga datos iniciales (roles, usuarios admin, etc.) para empezar a probar la app.
    ```bash
    pnpm db:seed
    ```

### 5. Ejecutar el Servidor de Desarrollo

Una vez configurado todo, inicia el servidor de Next.js:

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🛠 Comandos Útiles

Aquí tienes una lista de los scripts más utilizados en el día a día:

| Comando | Descripción |
| :--- | :--- |
| `pnpm dev` | Inicia el servidor de desarrollo con Turbopack. |
| `pnpm build` | Crea la versión optimizada para producción. |
| `pnpm start` | Inicia la versión de producción (requiere `build` previo). |
| `pnpm type-check` | Ejecuta la comprobación de tipos de TypeScript. Útil para validar antes de hacer push. |
| `pnpm lint` | Analiza el código en busca de errores y problemas de estilo usando Biome. |
| `pnpm format` | Formatea automáticamente el código usando Biome. |
| `pnpm db:studio` | Abre **Drizzle Studio** en el navegador para ver y editar la base de datos visualmente. |
| `pnpm db:generate` | Genera nuevos archivos de migración basados en cambios en el esquema. |

## 📂 Estructura del Proyecto

Breve descripción de las carpetas principales:

- **`/app`**: Código fuente de la aplicación (Next.js App Router). Aquí están las páginas, layouts y rutas de API.
- **`/components`**: Componentes de React reutilizables (UI, formularios, layouts compartidos).
- **`/db`**: Configuración de Drizzle ORM, esquemas de tablas y scripts de seed.
- **`/drizzle`**: Archivos SQL de las migraciones.
- **`/lib`**: Utilidades generales, configuración de librerías (auth, clientes API, validaciones).
- **`/public`**: Archivos estáticos públicos (imágenes, fuentes, iconos).
- **`/env.ts`**: Definición y validación de variables de entorno usando T3 Env.

## ✅ Calidad de Código

Este proyecto utiliza **Biome** para linting y formateo, y **TypeScript** estricto.
Se recomienda configurar tu editor (VS Code) para formatear al guardar y mostrar errores de Biome.

Para validar todo antes de subir cambios:

```bash
pnpm check
pnpm type-check
```

---
👋 **¡Bienvenido al equipo!** Si tienes dudas, revisa la documentación interna o contacta al líder técnico.
