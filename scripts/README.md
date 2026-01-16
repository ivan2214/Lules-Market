# Scripts de Automatización GitFlow

Este directorio contiene scripts para automatizar el flujo de trabajo GitFlow del proyecto.

## 📁 Archivos Disponibles

- **`git-flow.ps1`** - Script para Windows (PowerShell)
- **`git-flow.sh`** - Script para Linux/Mac (Bash)

## 🚀 Uso Rápido

### Windows (PowerShell)

```powershell
# Crear nueva feature
.\scripts\git-flow.ps1 new-feature -Name "nombre-de-la-feature"

# Crear nuevo fix
.\scripts\git-flow.ps1 new-fix -Name "nombre-del-fix"

# Sincronizar después de merge
.\scripts\git-flow.ps1 sync

# Ver estado del repositorio
.\scripts\git-flow.ps1 status
```

### Linux/Mac (Bash)

```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x scripts/git-flow.sh

# Crear nueva feature
./scripts/git-flow.sh new-feature nombre-de-la-feature

# Crear nuevo fix
./scripts/git-flow.sh new-fix nombre-del-fix

# Sincronizar después de merge
./scripts/git-flow.sh sync

# Ver estado del repositorio
./scripts/git-flow.sh status
```

## 📖 Comandos Detallados

### `new-feature`

Crea una nueva feature branch desde `dev`.

**Qué hace:**
1. Cambia a la rama `dev`
2. Actualiza `dev` con `git pull origin dev`
3. Crea una nueva rama `feature/nombre-de-la-feature`
4. Hace checkout a la nueva rama

**Ejemplo:**
```powershell
.\scripts\git-flow.ps1 new-feature -Name "login-social"
# Crea: feature/login-social
```

---

### `new-fix`

Crea una nueva fix branch desde `dev`.

**Qué hace:**
1. Cambia a la rama `dev`
2. Actualiza `dev` con `git pull origin dev`
3. Crea una nueva rama `fix/nombre-del-fix`
4. Hace checkout a la nueva rama

**Ejemplo:**
```powershell
.\scripts\git-flow.ps1 new-fix -Name "button-alignment"
# Crea: fix/button-alignment
```

---

### `sync`

Sincroniza el repositorio local después de mergear un PR en GitHub.

**Cuándo usar:**
- Después de mergear un PR de `feature` → `dev`
- Después de mergear un PR de `dev` → `main`

**Qué hace:**
1. Cambia a la rama `dev`
2. Hace `git fetch origin`
3. Hace `git rebase origin/main` (sincroniza dev con main)
4. Hace `git push origin dev --force` (actualiza origin/dev)
5. Hace `git fetch origin main:main` (actualiza main local sin checkout)
6. Muestra el estado actual

**Ejemplo:**
```powershell
.\scripts\git-flow.ps1 sync
```

**Resultado esperado:**
```
✅ Sincronización completada!
ℹ️  Estado actual:
On branch dev
nothing to commit, working tree clean
```

---

### `status`

Muestra el estado completo del repositorio.

**Qué muestra:**
- Rama actual
- Estado de todas las ramas (local y remoto)
- Últimos 8 commits en formato gráfico
- Estado del working tree

**Ejemplo:**
```powershell
.\scripts\git-flow.ps1 status
```

**Salida:**
```
ℹ️  Estado del repositorio:

📍 Rama actual: dev

🌿 Estado de las ramas:
* dev  5653ad5 chore: update husky pre-push hook
  main 5653ad5 [origin/main] chore: update husky pre-push hook

📝 Últimos commits:
* 5653ad5 (HEAD -> dev, origin/main, main) chore: update husky...
* 8495508 chore: update dependencies and refactor services
...

📊 Working tree:
On branch dev
nothing to commit, working tree clean
```

---

## 🔄 Flujo Completo de Ejemplo

```powershell
# 1. Crear nueva feature
.\scripts\git-flow.ps1 new-feature -Name "user-profile"

# 2. Trabajar en la feature
# ... hacer cambios en el código ...
git add .
git commit -m "feat: add user profile page"

# 3. Push de la feature
git push -u origin feature/user-profile

# 4. Crear PR en GitHub: feature/user-profile → dev
# 5. Mergear con "Squash and merge"

# 6. Sincronizar después del merge
.\scripts\git-flow.ps1 sync

# 7. Cuando dev esté listo, crear PR: dev → main
# 8. Mergear con "Rebase and merge"

# 9. Sincronizar de nuevo
.\scripts\git-flow.ps1 sync

# 10. Limpiar feature branch local
git branch -d feature/user-profile
```

---

## ⚠️ Notas Importantes

### Permisos en Linux/Mac

Si obtienes un error de permisos en Linux/Mac:

```bash
chmod +x scripts/git-flow.sh
```

### Force Push en `sync`

El comando `sync` hace un **force push** a `origin/dev`. Esto es intencional y seguro porque:
- Solo se hace después de sincronizar con `origin/main`
- `dev` siempre debe reflejar el estado de `main`
- Mantiene un historial limpio y lineal

### Conflictos durante Rebase

Si el comando `sync` falla por conflictos durante el rebase:

```bash
# 1. Resolver conflictos manualmente en los archivos
# 2. Agregar archivos resueltos
git add .

# 3. Continuar rebase
git rebase --continue

# 4. Completar la sincronización
git push origin dev --force
git fetch origin main:main
```

---

## 🆘 Solución de Problemas

### Error: "fatal: not a git repository"

Asegúrate de ejecutar el script desde la raíz del proyecto:

```powershell
cd c:\Dev\projects\Lules-Market
.\scripts\git-flow.ps1 status
```

### Error: "cannot be loaded because running scripts is disabled"

En Windows, si obtienes este error, ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### El script no encuentra `git`

Asegúrate de tener Git instalado y en el PATH:

```bash
git --version
```

---

## 📚 Documentación Adicional

Para más información sobre el flujo de trabajo completo, consulta:

- **`GIT_FLOW.MD`** - Documentación completa del flujo GitFlow
- **`.agent/workflows/`** - Workflows paso a paso

---

## 🎯 Ventajas de Usar los Scripts

✅ **Automatización** - Reduce errores manuales  
✅ **Consistencia** - Todos siguen el mismo flujo  
✅ **Velocidad** - Menos comandos para escribir  
✅ **Seguridad** - Validaciones integradas  
✅ **Claridad** - Mensajes informativos en cada paso  

---

¡Feliz desarrollo! 🚀
