# ⚡ Correcciones Rápidas Pendientes

Este documento lista las correcciones que puedes aplicar inmediatamente para mejorar el SEO y la seguridad.

## 🔴 Prioridad CRÍTICA (5 minutos)

### 1. Corregir precio hardcoded en Mercado Pago

**Archivo:** `app/actions/payment-actions.ts`

**Línea 42:**
```typescript
// ❌ ANTES (INCORRECTO)
unit_price: 1 || planLimits.price,

// ✅ DESPUÉS (CORRECTO)
unit_price: planLimits.price,
```

**Impacto:** Actualmente todos los pagos se crean con precio de $1 ARS en lugar del precio real del plan.

---

### 2. Habilitar optimización de imágenes

**Archivo:** `next.config.ts`

**Línea 6:**
```typescript
// ❌ ANTES
images: {
  unoptimized: true,
  // ...
}

// ✅ DESPUÉS
images: {
  unoptimized: false, // Habilitar optimización
  // ...
}
```

**Impacto:** 
- Mejora velocidad de carga en 40-60%
- Reduce tamaño de imágenes automáticamente
- Genera formatos modernos (WebP, AVIF)

---

## 🟡 Prioridad ALTA (30 minutos)

### 3. Añadir Structured Data a Productos

**Archivo:** `app/(public)/productos/[id]/page.tsx`

**Añadir al final del componente, antes del return:**
```typescript
import { ProductSchema } from "@/components/structured-data";

export default async function ProductPage({ params }: Props) {
  // ... código existente ...
  
  return (
    <>
      <ProductSchema
        name={product.name}
        description={product.description || undefined}
        price={product.price || undefined}
        currency="ARS"
        image={product.images?.[0]?.url}
        seller={{
          name: product.business?.name || "",
          url: `https://lules-market.vercel.app/comercios/${product.business?.id}`,
        }}
      />
      <div className="container space-y-8 p-8">
        {/* ... resto del JSX ... */}
      </div>
    </>
  );
}
```

---

### 4. Añadir Structured Data a Comercios

**Archivo:** `app/(public)/comercios/[id]/page.tsx`

**Añadir al final del componente:**
```typescript
import { LocalBusinessSchema } from "@/components/structured-data";

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  // ... código existente ...
  
  return (
    <>
      <LocalBusinessSchema
        name={business.name}
        description={business.description || undefined}
        address={business.address || undefined}
        phone={business.phone || undefined}
        email={business.email || undefined}
        image={business.logo?.url || business.coverImage?.url}
        url={`https://lules-market.vercel.app/comercios/${id}`}
      />
      <div className="container mx-auto space-y-8 py-8">
        {/* ... resto del JSX ... */}
      </div>
    </>
  );
}
```

---

### 5. Crear imagen OG por defecto

**Acción:** Crear o diseñar una imagen en `/public/og-image.jpg`

**Especificaciones:**
- Tamaño: 1200x630 píxeles
- Formato: JPG (optimizado)
- Contenido: Logo de Lules Market + tagline
- Texto legible incluso en thumbnails pequeños

**Herramientas sugeridas:**
- Canva: https://www.canva.com/ (template "Facebook Post")
- Figma: Diseño personalizado
- Photoshop/GIMP

---

## 🟢 Prioridad MEDIA (1-2 horas)

### 6. Implementar ISR en lugar de force-dynamic

**Archivos:**
- `app/(public)/productos/[id]/page.tsx`
- `app/(public)/comercios/[id]/page.tsx`

**Cambio:**
```typescript
// ❌ ANTES (Renderiza en cada request)
export const dynamic = "force-dynamic";

// ✅ DESPUÉS (Renderiza y cachea por 1 hora)
export const revalidate = 3600; // 1 hora en segundos
```

**Beneficios:**
- Páginas se sirven desde cache (más rápido)
- Se regeneran cada hora automáticamente
- Reduce carga en la base de datos

---

### 7. Añadir structured data a la home

**Archivo:** `app/(public)/page.tsx`

```typescript
import { OrganizationSchema } from "@/components/structured-data";

export default async function HomePage() {
  // ... código existente ...
  
  return (
    <>
      <OrganizationSchema
        name="Lules Market"
        description="Plataforma para comercios locales. Publica tus productos y servicios, aumenta tu visibilidad y atrae más clientes."
        url="https://lules-market.vercel.app"
        logo="https://lules-market.vercel.app/logo.webp"
      />
      <div className="mx-auto flex flex-col gap-y-20 p-5 md:py-10">
        {/* ... resto del JSX ... */}
      </div>
    </>
  );
}
```

---

## 📊 Verificación Post-Implementación

Después de aplicar los cambios, verifica:

### SEO
```bash
# Test de Google Rich Results
https://search.google.com/test/rich-results

# Pegar URL de tu sitio y verificar structured data
```

### Performance
```bash
# Lighthouse
npx lighthouse https://lules-market.vercel.app --view

# Objetivo: Score > 90 en Performance
```

### Seguridad
```bash
# Verificar headers
curl -I https://lules-market.vercel.app | grep -i "x-"

# Deben aparecer:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
```

### Mercado Pago
```bash
# Test de webhook con herramienta de MP
https://www.mercadopago.com.ar/developers/panel/app/webhooks/test

# Verificar que el precio se cree correctamente
```

---

## 📝 Checklist de Implementación

- [ ] Corregir precio hardcoded en payment-actions.ts
- [ ] Habilitar optimización de imágenes en next.config.ts
- [ ] Añadir ProductSchema a productos
- [ ] Añadir LocalBusinessSchema a comercios
- [ ] Crear imagen og-image.jpg
- [ ] Implementar ISR en productos y comercios
- [ ] Añadir OrganizationSchema a home
- [ ] Verificar con Rich Results Test
- [ ] Test de Lighthouse
- [ ] Test de webhook de Mercado Pago

---

## 🚀 Deploy

Después de los cambios:

```bash
# 1. Verificar que todo compile
pnpm build

# 2. Commit y push
git add .
git commit -m "fix: SEO improvements and MP price fix"
git push

# 3. Vercel deployará automáticamente
```

---

**Tiempo total estimado:** 2-3 horas
**Impacto esperado:** +30% en SEO score, mejora de performance
