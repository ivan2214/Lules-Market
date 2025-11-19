# Next.js — Guía completa sobre Cache Components

> Archivo de referencia en español para entender e implementar las directivas de caché (`'use cache'`, `'use cache: private'`, `'use cache: remote'`) en proyectos con App Router (Next.js 13/14/15+). Incluye: explicación conceptual, escenarios, ejemplos, mejores prácticas, migración y soluciones a problemas comunes.

---

## Índice

1. ¿Qué es "Cache Components"?
2. Directivas disponibles
   - `use cache`
   - `use cache: private`
   - `use cache: remote`
3. Conceptos clave
   - Clave de caché
   - Caché por request vs caché persistente
   - `cacheLife`, `cacheTag` y revalidación
   - Serialización de argumentos
4. Interacción con datos de runtime (headers, cookies, searchParams)
5. Suspense y renderizado híbrido (streaming)
6. Tipos de escenarios y patrones de implementación
   - Componentes totalmente estáticos
   - Componentes compartidos entre usuarios (cache pública)
   - Componentes dependientes de sesión (cache privada)
   - Datos globales/metrics (cache remota)
   - Layouts protegidos (sesión/admin)
7. Ejemplos prácticos
   - Página estática con `use cache`
   - Layout con sesión usando `use cache: private`
   - Llamada a API con `use cache: remote` + `cacheTag` y `cacheLife`
   - Separar UI cacheada vs UI dinámica con `Suspense`
8. Estrategias de invalidación y coherencia de datos
9. Seguridad y consideraciones sobre sesiones
10. Debugging, pruebas y checklist de migración
11. Preguntas frecuentes (FAQ)

---

## 1. ¿Qué es "Cache Components"?

Es el sistema de Next.js (App Router) para dar control fino sobre **qué** se cachea, **cómo** y **para quién**. Permite combinar prerenderizado, streaming y revalidación, y ofrece tres modos principales de directivas: pública (compartida), privada (por usuario) y remota (compartida y sincronizada entre instancias).

La motivación: mejorar rendimiento sin sacrificar corrección de datos en escenarios que dependen de la petición o la sesión.


## 2. Directivas disponibles

### `use cache`

- Marca un componente/función para que sea cacheada globalmente (compartida entre usuarios) si no depende de datos de la petición.
- Requiere `cacheComponents: true` en `next.config.ts` (según la versión de Next.js).
- No usar si la salida depende de `headers()`, `cookies()`, `searchParams` o datos por usuario.

Ejemplo:
```ts
'use cache'
export default async function Posts() {
  const posts = await getPostsFromAPI();
  return <PostsList posts={posts} />;
}
```


### `use cache: private`

- Cachea la salida **por usuario / sesión**. La caché es aislada por credenciales (cookie/token), evitando fugas entre usuarios.
- Ideal para dashboards, layouts que muestran información del usuario, etc.

Ejemplo:
```ts
'use cache: private'
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return <div>Hola {user.name}{children}</div>;
}
```


### `use cache: remote`

- Indica que la caché debe sincronizarse con una **capa remota** (p. ej. Vercel Data Cache o Redis administrado) para que pueda ser leída/escrita por múltiples instancias.
- Útil en arquitecturas distribuidas/edge donde la memoria local no es suficiente.

Ejemplo:
```ts
'use cache: remote'
export async function getGlobalMetrics() {
  return fetchMetricsFromAPI();
}
```


## 3. Conceptos clave

### Clave de caché

La clave que genera Next.js usa:
- El `buildId` (identifica la compilación),
- Un identificador de la función/componente,
- Los args serializables (props) usados en la invocación.

Si todo coincide, se reutiliza la entrada de caché.


### Caché por request vs caché persistente

- `cache()` (de React) o memoización simple suele ser **por request**: evita recomputar dentro de la misma renderización, pero NO persiste entre peticiones.
- Las directivas `use cache` pueden guardar en memoria del servidor (o remota si `remote`) y **persistir** entre requests.


### `cacheLife` y `cacheTag`

- `cacheLife(...)` permite definir TTL (time-to-live) para entradas de caché. Ej: 30s, 5m, 1h.
- `cacheTag(...)` permite agrupar entradas y luego invalidar por tag (invalidate tag-based).

*Nota:* la API concreta para `cacheLife`/`cacheTag` puede variar por versión — revisar la documentación correspondiente y la configuración de provider (Vercel, Redis, etc.).


### Argumentos no serializables

Si pasás callbacks, clases, o referencias complejas como argumentos, esos **no** forman parte de la clave de caché (no serializables). Se pasan igual a la ejecución, pero la caché puede colisionar si usás solo argumentos no serializables.


## 4. Interacción con datos de runtime

Si tu componente o función accede a:
- `cookies()`
- `headers()`
- `searchParams` (cuando vienen de la req)

Entonces la salida **depende de la petición** y **no** deberías usar `use cache` pública. En su lugar:
- Usar `use cache: private` (si querés cache por usuario), o
- No cachear (dejar dinámico) y/o usar `force-dynamic`.

Next.js detecta estas dependencias y marcará el segmento como `dynamic` si intenta cachearse incorrectamente.


## 5. Suspense y renderizado híbrido

Patrón recomendado para combinar partes estáticas y dinámicas:

- Renderizar un *shell* estático (cacheable) que cargue rápido.
- Dentro, usar `<Suspense>` para componentes dinámicos que requieren datos de la petición o llamadas lentas.

Ejemplo:
```tsx
export default function Page() {
  return (
    <div>
      <Header /> {/* cacheable */}
      <Suspense fallback={<Spinner />}>
        <UserWidget /> {/* depende de sesión */}
      </Suspense>
      <main>
        <PostsList /> {/* cacheable */}
      </main>
    </div>
  );
}
```

Con streaming, el shell llega primero y las partes dentro de `Suspense` se van "lleneando" cuando estén listas.


## 6. Tipos de escenarios y patrones

### 6.1 Componentes totalmente estáticos (p. ej. marketing)

- Directiva: `use cache` o sin directiva (depende de la configuración de SSG).
- Ejemplo: footers, hero estático, listados públicos que cambian raramente.

### 6.2 Componentes compartidos entre usuarios

- Directiva: `use cache` o `use cache: remote` si necesitas compartir entre regiones/instancias.
- Ejemplo: listado de posts populares, configuraciones globales.

### 6.3 Componentes dependientes de sesión

- Directiva: `use cache: private`.
- Ejemplo: dashboard, header con nombre del usuario, panel de administración.

### 6.4 Datos globales/metrics

- Directiva: `use cache: remote` + `cacheTag`.
- Ejemplo: métricas live, contadores, datos costosos de calcular.

### 6.5 Layouts protegidos (ej. Admin)

- Recomendación: marcar explícitamente como `force-dynamic` o usar `use cache: private` si querés caché por usuario.
- Evitar `use cache` pública porque la sesión y permisos deben ser únicos.


## 7. Ejemplos prácticos

### 7.1 Página estática con `use cache`

```ts
'use cache'
export default async function PostsPage() {
  const posts = await getPosts();
  return <PostsList posts={posts} />;
}
```

### 7.2 Layout con sesión usando `use cache: private`

```ts
'use cache: private'
import { getCurrentUser } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser(); // usa headers/cookies internamente
  if (!user) redirect('/auth/signin');

  return (
    <div className="admin-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

- La caché será por usuario. Si el usuario refresca la página, Next.js puede servir la versión cacheada para ese usuario.


### 7.3 `use cache: remote` + invalidación por tag

```ts
'use cache: remote'
import { cacheTag, cacheLife } from 'next/cache';

export async function getReports() {
  cacheTag('reports');
  cacheLife(60); // 60s
  return fetchReportsFromAPI();
}

// En otro endpoint (webhook) que actualiza datos:
export async function revalidateReports() {
  // Invalida tag "reports" en la cache remota
  // provider-specific call (Vercel API o Redis purge)
}
```

> Nota: la forma de invalidar tags depende del proveedor.


### 7.4 Mezclar cacheada y dinámica en un layout (tu caso Admin)

Separá visualmente lo que **no** depende de la sesión (sidebar estática) y lo que sí (header con usuario). Ejemplo:

```tsx
// AdminLayout.tsx
'use cache: private';
import { Suspense } from 'react';
import Sidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminGuard from './AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar /> {/* si no depende de user, podrías extraerlo con 'use cache' pública en un archivo separado */}
      <div>
        <Suspense fallback={<HeaderSkeleton />}>
          <AdminHeader /> {/* depende de sesión -> cache:private */}
        </Suspense>
        <main>
          <Suspense fallback={<Loading />}>
            <AdminGuard>{children}</AdminGuard>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
```


## 8. Estrategias de invalidación y coherencia

- **TTL (cacheLife)**: buen equilibrio entre frescura y rendimiento. Para datos que cambian cada pocos minutos usar 30s-5m.
- **Tag-based invalidation**: agrupa entradas con `cacheTag` y purga por tag después de un cambio.
- **Webhooks**: cuando tu backend cambia datos (p. ej. CMS), dispara un webhook para invalidar cache remota.
- **Estrategia híbrida**: cachear por usuario (`private`) pero con TTL corto para cambios de permisos.


## 9. Seguridad y consideraciones sobre sesiones

- **Nunca** uses `use cache` pública para datos que incluyan información sensible del usuario.
- `use cache: private` debe confiar en las cookies/tokens para aislar la caché; asegurar que el provider respete esa segregación.
- Revisar headers `Cache-Control` y políticas del provider (Vercel, Cloudflare) para evitar fugas.


## 10. Debugging, pruebas y checklist de migración

Checklist para migrar o implementar:
1. Identificar componentes que dependen de la petición/usuario.
2. Marcar como `use cache: private` los que dependen de sesión.
3. Marcar como `use cache` los recursos compartibles entre usuarios.
4. Decidir si `use cache: remote` es necesario para compartir entre regiones.
5. Añadir `Suspense` para dividir UI estática/dinámica.
6. Implementar `cacheLife` y `cacheTag` donde tenga sentido.
7. Probar manualmente: cambiar recursos, verificar invalidación.
8. Automatizar invalidación con webhooks/procesos background (provider-specific).

Debugging tips:
- Forzar `export const dynamic = 'force-dynamic'` para comprobar comportamiento dinámico.
- Revisar headers de respuesta y logs del servidor para ver si se está leyendo la caché.


## 11. FAQ (preguntas frecuentes)

**P**: ¿Puedo meter `cookies()` dentro de una función marcada `use cache`?  
**R**: No. Si tu función lee cookies, no debe ser cache pública. Usa `use cache: private` o no cachear.

**P**: ¿Qué pasa si paso una función como prop a un componente cacheado?  
**R**: Las funciones no se serializan para la clave. La caché puede colisionar si las props serializables no distinguen las llamadas.

**P**: ¿`cache()` de React es lo mismo que `use cache`?  
**R**: No. `cache()` memoiza en tiempo de ejecución (por request). `use cache` crea entradas de caché reutilizables entre requests.


---

### Recursos adicionales
- Documentación oficial de Next.js (App Router) — directivas de cache
- Provider docs (Vercel Data Cache, Redis, Cloudflare)

---

Si querés, puedo:
- Generar ejemplos concretos con tu código (tu `AdminLayout` y `requireAdmin`).
- Sugerir configuración `next.config.ts` y provider para caché remota (p. ej. Vercel/Redis).
- Añadir scripts de invalidación para webhooks.

Fin del documento.

