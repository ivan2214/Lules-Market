# Configuración de Vercel Firewall para Sitemap y Robots.txt

## ⚠️ Importante

La configuración del firewall **NO** se puede hacer en `vercel.json`. Debe configurarse manualmente en el dashboard de Vercel.

## 📋 Pasos para Configurar el Firewall

### 1. Acceder al Dashboard de Vercel

1. Ir a: https://vercel.com/dashboard
2. Seleccionar el proyecto: **Lules-Market**
3. Ir a **Settings** → **Firewall**

### 2. Crear Regla para Sitemap

**Nombre**: `Allow Sitemap`

**Configuración**:
```
Condition Type: Path
Operator: Equals
Value: /sitemap.xml

Action: Allow
```

### 3. Crear Regla para Robots.txt

**Nombre**: `Allow Robots`

**Configuración**:
```
Condition Type: Path
Operator: Equals
Value: /robots.txt

Action: Allow
```

### 4. Orden de las Reglas

Las reglas deben estar **antes** de cualquier regla de bloqueo general. El orden importa:

1. ✅ Allow Sitemap
2. ✅ Allow Robots
3. 🛡️ (Otras reglas de seguridad)

## 🔍 Verificación

Después de configurar, verificar con:

```bash
# Verificar sitemap
curl -I https://lulesmarket.vercel.app/sitemap.xml

# Verificar robots
curl -I https://lulesmarket.vercel.app/robots.txt
```

Ambos deben retornar **200 OK** sin redirecciones al Security Checkpoint.

## 📸 Captura de Pantalla de Ejemplo

La configuración en el dashboard debe verse así:

```
┌─────────────────────────────────────────┐
│ Firewall Rules                          │
├─────────────────────────────────────────┤
│ ✓ Allow Sitemap                         │
│   Path equals /sitemap.xml              │
│   Action: Allow                         │
├─────────────────────────────────────────┤
│ ✓ Allow Robots                          │
│   Path equals /robots.txt               │
│   Action: Allow                         │
└─────────────────────────────────────────┘
```

## 🚨 Troubleshooting

### Si el sitemap sigue bloqueado:

1. **Verificar orden de reglas**: Las reglas "Allow" deben estar primero
2. **Limpiar caché**: Settings → Data Cache → Purge Everything
3. **Esperar propagación**: Puede tardar 1-2 minutos
4. **Verificar path exacto**: Debe ser `/sitemap.xml` (sin trailing slash)

### Si aparece "Security Checkpoint":

1. Verificar que las reglas estén **activas** (toggle verde)
2. Verificar que el path sea exactamente `/sitemap.xml` y `/robots.txt`
3. Contactar soporte de Vercel si persiste

## 📚 Documentación Oficial

- [Vercel Firewall Documentation](https://vercel.com/docs/security/firewall)
- [Vercel Firewall Rules](https://vercel.com/docs/security/firewall/rules)

## ✅ Headers Configurados

Los headers ya están configurados en `vercel.json` y `next.config.mjs`:

- ✅ `X-Robots-Tag: all`
- ✅ `Access-Control-Allow-Origin: *`
- ✅ `Content-Type: application/xml`
- ✅ `x-vercel-disable-early-hints: 1`

Solo falta configurar el firewall manualmente en el dashboard.
