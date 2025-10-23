# Guía de Implementación de Caché en Next.js 16

## Descripción General

Esta aplicación ha sido actualizada a **Next.js 16.0.0** y ahora utiliza estrategias avanzadas de caché para optimizar el rendimiento y reducir las consultas a la base de datos.

## Capas de Caché

### 1. Función `cache()` de React (Deduplicación a Nivel de Solicitud)

Utilizada en las clases de Capa de Acceso a Datos (DAL) para deduplicar consultas **dentro de una sola solicitud**:

- **Ubicación**: `app/data/business/business.dal.ts`, `app/data/product/product.dal.ts`
- **Propósito**: Previene consultas duplicadas durante la misma solicitud (por ejemplo, cuando el mismo producto se obtiene varias veces en diferentes componentes)
- **Alcance**: Solo una solicitud
- **Se limpia automáticamente**: Después de que se completa la solicitud

**Ejemplo**:
```typescript
// En product.dal.ts
getProductById = cache(async (productId: string): Promise<ProductDTO | null> => {
  const product = await prisma.product.findFirst({
    where: { id: productId, active: true },
    include: { business: true, images: true }
  });
  return product;
});
```

### 2. Función `unstable_cache()` (Caché Persistente del Lado del Servidor)

Utilizada en acciones del servidor públicas para **caché persistente del lado del servidor**:

- **Ubicación**: `app/actions/public-actions.ts`
- **Propósito**: Cachear datos entre solicitudes con tiempos de revalidación configurables
- **Alcance**: Compartido entre todas las solicitudes
- **Etiquetas de Caché**: Permiten invalidación de caché dirigida

**Ejemplo**:
```typescript
export async function getPublicProducts(params?: {...}) {
  return unstable_cache(
    async () => {
      const productDAL = await ProductDAL.public();
      return await productDAL.listAllProducts(params);
    },
    [`public-products-${search}-${category}-${businessId}-${page}-${limit}-${sort}`],
    {
      tags: [CACHE_TAGS.PUBLIC_PRODUCTS, CACHE_TAGS.PRODUCTS],
      revalidate: CACHE_REVALIDATE.SHORT, // 60 segundos
    }
  )();
}
```

## Sistema de Etiquetas de Caché

Gestión centralizada de etiquetas de caché en `lib/cache-tags.ts`:

### Etiquetas Disponibles

```typescript
CACHE_TAGS = {
  // Etiquetas de negocios
  BUSINESSES: 'businesses',
  PUBLIC_BUSINESSES: 'public-businesses',
  businessById: (id: string) => `business-${id}`,
  
  // Etiquetas de productos
  PRODUCTS: 'products',
  PUBLIC_PRODUCTS: 'public-products',
  productById: (id: string) => `product-${id}`,
  
  // Etiquetas de categorías
  CATEGORIES: 'categories',
}
```

### Tiempos de Revalidación

```typescript
CACHE_REVALIDATE = {
  SHORT: 60,        // 1 minuto - datos que cambian frecuentemente
  MEDIUM: 300,      // 5 minutos - datos que cambian moderadamente
  LONG: 600,        // 10 minutos - datos que raramente cambian
  VERY_LONG: 3600,  // 1 hora - datos tipo estáticos
}
```

## Estrategia de Revalidación de Caché

### Revalidación Automática

Cuando los datos son modificados (crear/actualizar/eliminar), usamos `revalidateTag()` con el perfil `'max'`:

```typescript
// En product.action.ts
if (result.successMessage) {
  revalidateTag(CACHE_TAGS.PRODUCTS, 'max');
  revalidateTag(CACHE_TAGS.PUBLIC_PRODUCTS, 'max');
  revalidateTag(CACHE_TAGS.productById(productId), 'max');
  revalidateTag(CACHE_TAGS.CATEGORIES, 'max');
}
```

**El perfil `'max'` proporciona:**
- Semántica stale-while-revalidate
- Revalidación en segundo plano
- Los usuarios obtienen respuestas instantáneas (datos obsoletos)
- Datos frescos obtenidos en segundo plano

### Disparadores de Revalidación

| Acción | Etiquetas Revalidadas |
|--------|----------------------|
| Crear Producto | `products`, `public-products`, `categories` |
| Actualizar Producto | `products`, `public-products`, `product-{id}`, `categories` |
| Eliminar Producto | `products`, `public-products`, `product-{id}`, `categories` |
| Crear Negocio | `businesses`, `public-businesses` |
| Actualizar Negocio | `businesses`, `public-businesses`, `business-{id}` |

## Beneficios de Rendimiento

### Antes del Caché
- ❌ Consultas duplicadas dentro de la misma solicitud
- ❌ Consulta a la base de datos en cada carga de página
- ❌ Tiempos de respuesta lentos para páginas públicas

### Después del Caché
- ✅ Deduplicación a nivel de solicitud con `cache()`
- ✅ Caché de 60-600 segundos en datos públicos
- ✅ Revalidación automática en segundo plano
- ✅ Invalidación instantánea de caché en cambios de datos
- ✅ Carga reducida en la base de datos

## Mejores Prácticas

### 1. Usar `cache()` para Todos los Métodos DAL
Siempre envolver los métodos de obtención de datos en `cache()`:
```typescript
getDataById = cache(async (id: string) => {
  return await prisma.model.findUnique({ where: { id } });
});
```

### 2. Usar `unstable_cache()` para Rutas Públicas
Los datos públicos se benefician más del caché persistente:
```typescript
export async function getPublicData() {
  return unstable_cache(
    async () => { /* obtener datos */ },
    ['cache-key'],
    { tags: ['tag'], revalidate: 60 }
  )();
}
```

### 3. Siempre Revalidar Después de Mutaciones
Al crear/actualizar/eliminar, revalidar las etiquetas relevantes:
```typescript
revalidateTag(CACHE_TAGS.PRODUCTS, 'max');
```

### 4. Usar Claves de Caché Descriptivas
Incluir todos los parámetros que afectan el resultado:
```typescript
[`products-${search}-${category}-${page}-${limit}-${sort}`]
```

### 5. Granularidad de Etiquetas
Usar múltiples etiquetas para invalidación flexible:
```typescript
tags: [
  CACHE_TAGS.PUBLIC_PRODUCTS,  // Invalidación amplia
  CACHE_TAGS.PRODUCTS,          // Granularidad media
  CACHE_TAGS.productById(id)    // Invalidación específica
]
```

## Lista de Verificación de Migración

- [x] Actualizar Next.js a 16.0.0
- [x] Actualizar React a 19.2.0
- [x] Agregar `cache()` a todos los métodos de lectura DAL
- [x] Envolver acciones públicas con `unstable_cache()`
- [x] Crear sistema centralizado de etiquetas de caché
- [x] Agregar `revalidateTag()` a todas las mutaciones
- [x] Usar el perfil `'max'` para stale-while-revalidate

## Monitoreo y Depuración

### Verificar Comportamiento del Caché
1. **Desarrollo**: El caché está deshabilitado en modo desarrollo por defecto
2. **Producción**: Monitorear tasas de aciertos de caché vía Next.js analytics

### Depurar Problemas de Caché
- Verificar que las claves de caché sean únicas y descriptivas
- Verificar que las etiquetas estén asignadas correctamente
- Asegurar que `revalidateTag()` se llame en las mutaciones
- Usar el perfil `'max'` para revalidación en segundo plano

## Próximos Pasos

### Mejoras Opcionales
1. Agregar configuración de `cacheLife` en `next.config.ts`
2. Implementar perfiles de caché personalizados para diferentes tipos de datos
3. Agregar precalentamiento de caché para rutas críticas
4. Monitorear métricas de rendimiento del caché

## Aprender Más

- [Guía de Caché de Next.js 16](https://nextjs.org/docs/app/guides/caching)
- [Referencia de la API revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
- [Función cache() de React](https://react.dev/reference/react/cache)
