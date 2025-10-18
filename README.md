# Plataforma de Comercios Locales

Plataforma web completa para pequeños comercios locales con sistema de planes de suscripción. Permite a los comercios publicitar sus productos y servicios, mientras que los clientes pueden explorar y contactarlos directamente.

## Características Principales

### Para Comercios
- **Autenticación segura**: Sistema completo con Better-Auth (email/password)
- **Gestión de productos**: Crear, editar y eliminar productos con imágenes
- **Planes de suscripción**: Tres niveles (Gratuito, Básico, Premium)
- **Perfil de negocio**: Información completa con redes sociales y contacto
- **Sistema de encuestas**: Crea encuestas para recopilar feedback
- **Estadísticas**: Analytics de vistas y rendimiento según plan
- **Productos destacados**: Resalta tus mejores productos (Premium)

### Para Clientes
- **Catálogo público**: Explora productos y comercios sin registro
- **Búsqueda avanzada**: Filtra por categorías y palabras clave
- **Contacto directo**: WhatsApp, teléfono, email, redes sociales
- **Responder encuestas**: Ayuda a los comercios con feedback anónimo

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Autenticación**: Better-Auth
- **Base de datos**: PostgreSQL con Prisma ORM
- **Estilos**: Tailwind CSS v4 + Shadcn/UI
- **Pagos**: Mercado Pago SDK (Checkout Pro)
- **Gráficos**: Recharts
- **Gestión de paquetes**: pnpm

## Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- pnpm (recomendado) o npm
- PostgreSQL (o cuenta en Neon/Supabase)
- Cuenta de Mercado Pago

### Paso 1: Clonar e instalar dependencias

\`\`\`bash
# Clonar el repositorio
git clone <tu-repositorio>
cd local-business-platform

# Instalar dependencias con pnpm
pnpm install
\`\`\`

### Paso 2: Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

\`\`\`bash
cp .env.example .env
\`\`\`

Edita el archivo `.env` con tus credenciales:

\`\`\`env
# Database (Neon, Supabase, o PostgreSQL local)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Better Auth
BETTER_AUTH_SECRET="tu-secret-key-aqui" # Genera con: openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Mercado Pago
NEXT_PUBLIC_MP_PUBLIC_KEY="tu-public-key-de-mercadopago"
MP_ACCESS_TOKEN="tu-access-token-de-mercadopago"
\`\`\`

### Paso 3: Configurar la base de datos

\`\`\`bash
# Generar cliente de Prisma
pnpm prisma generate

# Crear las tablas en la base de datos
pnpm prisma db push

# O ejecutar el script SQL directamente (ya incluido en el proyecto)
# El script 001_init_database.sql se ejecutará automáticamente
\`\`\`

### Paso 4: Iniciar el servidor de desarrollo

\`\`\`bash
pnpm dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

\`\`\`
├── app/
│   ├── (public)/          # Rutas públicas (landing, catálogo, productos)
│   ├── auth/              # Páginas de autenticación (signin, signup)
│   ├── dashboard/         # Panel de administración para comercios
│   └── api/               # API routes (auth, webhooks)
├── components/
│   ├── auth/              # Componentes de autenticación
│   ├── dashboard/         # Componentes del dashboard
│   ├── public/            # Componentes públicos (navbar, footer)
│   └── ui/                # Componentes de Shadcn/UI
├── lib/
│   ├── actions/           # Server Actions de Next.js
│   ├── auth.ts            # Configuración de Better-Auth
│   ├── db.ts              # Cliente de Prisma
│   └── mercadopago.ts     # Configuración de Mercado Pago
├── prisma/
│   └── schema.prisma      # Esquema de base de datos
├── scripts/
│   └── 001_init_database.sql  # Script de inicialización
└── types/
    └── index.ts           # Definiciones de tipos TypeScript
\`\`\`

## Planes de Suscripción

### Plan Gratuito (FREE)
- ✅ Hasta 5 productos
- ✅ Perfil básico de negocio
- ✅ Información de contacto
- ✅ Enlaces a redes sociales
- ❌ Sin estadísticas
- ❌ Sin productos destacados
- ❌ Prioridad baja en búsquedas

### Plan Básico (BASIC) - $9.99 USD
- ✅ Hasta 20 productos
- ✅ Perfil completo de negocio
- ✅ **Estadísticas básicas**
- ✅ Información de contacto
- ✅ Enlaces a redes sociales
- ✅ Soporte por email
- ❌ Sin productos destacados
- ⚡ Prioridad media en búsquedas

### Plan Premium (PREMIUM) - $29.99 USD
- ✅ **Productos ilimitados**
- ✅ Perfil destacado
- ✅ **Estadísticas avanzadas**
- ✅ **Productos destacados**
- ✅ **Prioridad alta en búsquedas**
- ✅ Información de contacto
- ✅ Enlaces a redes sociales
- ✅ **Soporte prioritario**

## Configuración de Mercado Pago

1. Crea una cuenta en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
2. Obtén tus credenciales (Public Key y Access Token)
3. Configura el webhook en tu panel de Mercado Pago:
   - URL: `https://tu-dominio.com/api/webhooks/mercadopago`
   - Eventos: `payment`

## Uso de la Plataforma

### Para Comercios

1. **Registro**: Crea una cuenta en `/auth/signup`
2. **Configurar negocio**: Completa tu perfil en `/dashboard/setup`
3. **Agregar productos**: Crea productos en `/dashboard/products`
4. **Elegir plan**: Actualiza tu plan en `/dashboard/subscription`
5. **Ver estadísticas**: Revisa el rendimiento en `/dashboard/analytics`
6. **Crear encuestas**: Recopila feedback en `/dashboard/surveys`

### Para Clientes

1. **Explorar**: Navega el catálogo en `/explorar`
2. **Buscar**: Usa filtros por categoría y búsqueda
3. **Ver detalles**: Haz clic en productos para ver información completa
4. **Contactar**: Usa WhatsApp, teléfono o redes sociales del comercio

## Scripts Disponibles

\`\`\`bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo

# Producción
pnpm build            # Construye para producción
pnpm start            # Inicia servidor de producción

# Base de datos
pnpm prisma generate  # Genera cliente de Prisma
pnpm prisma db push   # Sincroniza schema con DB
pnpm prisma studio    # Abre Prisma Studio (GUI)

# Linting y formato
pnpm lint             # Ejecuta ESLint
\`\`\`

## Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otras plataformas

Asegúrate de:
- Configurar todas las variables de entorno
- Ejecutar `pnpm prisma generate` en el build
- Configurar el webhook de Mercado Pago con tu dominio

## Seguridad

- ✅ Autenticación con Better-Auth (bcrypt para passwords)
- ✅ Validación de sesiones en middleware
- ✅ Server Actions para operaciones sensibles
- ✅ Validación de límites de plan
- ✅ Webhook signature verification (Mercado Pago)
- ✅ SQL injection protection (Prisma)

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Soporte

Para soporte, abre un issue en GitHub o contacta a [tu-email@ejemplo.com]

## Roadmap

- [ ] Integración con más pasarelas de pago
- [ ] Sistema de reseñas y calificaciones
- [ ] Notificaciones push
- [ ] App móvil (React Native)
- [ ] Sistema de cupones y descuentos
- [ ] Integración con redes sociales (login)
- [ ] Multi-idioma (i18n)
# Lules-Market
