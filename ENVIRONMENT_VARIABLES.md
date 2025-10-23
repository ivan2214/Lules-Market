# 🔐 Variables de Entorno Requeridas

Este documento lista todas las variables de entorno necesarias para ejecutar Lules Market.

## Variables Críticas

### Base de Datos
```bash
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```
- **Requerido:** Sí
- **Descripción:** URL de conexión a PostgreSQL
- **Ejemplo:** `postgresql://postgres:password@localhost:5432/lulesmarket`

### Mercado Pago
```bash
MP_ACCESS_TOKEN="APP_USR-XXXXXXXX"
```
- **Requerido:** Sí
- **Descripción:** Access Token de Mercado Pago (de tu aplicación)
- **Dónde obtenerlo:** https://www.mercadopago.com.ar/developers/panel/credentials

```bash
MP_WEBHOOK_SECRET="tu_webhook_secret"
```
- **Requerido:** Sí
- **Descripción:** Secret para verificar webhooks de Mercado Pago
- **Dónde configurarlo:** Panel de Mercado Pago > Tu aplicación > Webhooks

### Aplicación
```bash
APP_URL="https://lules-market.vercel.app"
```
- **Requerido:** Sí
- **Descripción:** URL base de la aplicación (sin trailing slash)
- **Desarrollo:** `http://localhost:3000`
- **Producción:** `https://tu-dominio.com`

### Better Auth (Autenticación)
```bash
BETTER_AUTH_SECRET="tu_secret_aleatorio_largo_y_seguro"
```
- **Requerido:** Sí
- **Descripción:** Secret para firmar tokens de autenticación
- **Generar:** `openssl rand -base64 32`

```bash
BETTER_AUTH_URL="https://lules-market.vercel.app"
```
- **Requerido:** Sí (producción)
- **Descripción:** URL para Better Auth
- **Debe coincidir con:** APP_URL

## Variables Opcionales

### AWS S3 (Almacenamiento de Imágenes)
```bash
AWS_ACCESS_KEY_ID="tu_access_key"
AWS_SECRET_ACCESS_KEY="tu_secret_key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="lules-market-images"
```
- **Requerido:** Sí (si usas S3)
- **Descripción:** Credenciales para almacenar imágenes en S3

### Node Environment
```bash
NODE_ENV="production"
```
- **Requerido:** No (auto-detectado)
- **Valores:** `development` | `production` | `test`

## Archivo .env de Ejemplo

Crea un archivo `.env` en la raíz del proyecto con este contenido:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/lulesmarket"

# Mercado Pago
MP_ACCESS_TOKEN="APP_USR-XXXXXXXX-XXXXXX-XXXXXXXX"
MP_WEBHOOK_SECRET="tu_webhook_secret_aqui"

# App
APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="genera_un_secret_aleatorio_con_openssl"
BETTER_AUTH_URL="http://localhost:3000"

# AWS S3 (opcional)
AWS_ACCESS_KEY_ID="tu_access_key"
AWS_SECRET_ACCESS_KEY="tu_secret_key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="lules-market-images"
```

## Verificación de Variables

Para verificar que todas las variables están configuradas:

```bash
# Desarrollo
pnpm dev

# Si falta alguna variable crítica, la app te lo indicará
```

## Seguridad

⚠️ **IMPORTANTE:**
- Nunca commitees el archivo `.env` al repositorio
- `.env` ya está en `.gitignore` ✅
- En producción (Vercel), configura las variables en el dashboard
- Rota el `BETTER_AUTH_SECRET` periódicamente
- Usa diferentes secrets en desarrollo y producción

## Configuración en Vercel

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Añade cada variable con su valor correspondiente
4. Selecciona el entorno (Production, Preview, Development)

## Webhook de Mercado Pago

Configurar la URL del webhook en Mercado Pago:

1. Ir a: https://www.mercadopago.com.ar/developers/panel/app
2. Seleccionar tu aplicación
3. Ir a Webhooks
4. URL: `https://tu-dominio.com/api/webhooks/mercadopago`
5. Eventos: Seleccionar "Pagos"
6. Copiar el "Secret" y usarlo en `MP_WEBHOOK_SECRET`

## Testing Local de Webhooks

Para probar webhooks localmente:

```bash
# Instalar ngrok
npm install -g ngrok

# Exponer tu localhost
ngrok http 3000

# Usar la URL de ngrok en Mercado Pago (temporal)
# Ejemplo: https://xxxx-xx-xx-xxx-xxx.ngrok.io/api/webhooks/mercadopago
```
