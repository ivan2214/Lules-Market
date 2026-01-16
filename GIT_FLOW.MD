# Gitflow - Flujo de Trabajo Automatizado

Este documento describe el flujo de trabajo GitFlow automatizado del proyecto, diseñado para mantener un repositorio limpio, organizado y con producción estable.

> 🚀 **NUEVO**: Ahora con scripts de automatización y workflows para agilizar tu trabajo.

---

## 📋 Tabla de Contenidos

1. [Filosofía del Flujo](#filosofía-del-flujo)
2. [Automatización con Scripts](#automatización-con-scripts)
3. [Workflows Disponibles](#workflows-disponibles)
4. [Flujo Completo Paso a Paso](#flujo-completo-paso-a-paso)
5. [Reglas Importantes](#reglas-importantes)

---

## 🎯 Filosofía del Flujo

### Ramas Principales

* **`main`** → Producción, siempre estable
  * ⚠️ **NUNCA se toca directamente en local**
  * Solo se actualiza mediante PRs desde `dev` en GitHub
  * Se sincroniza localmente con `git fetch origin main:main`

* **`dev`** → Integración y desarrollo
  * Rama base para todo el trabajo
  * Siempre sincronizada con `main` después de cada merge
  * Aquí se integran todas las features

* **`feature/*`** o **`fix/*`** → Ramas de trabajo
  * Se crean desde `dev`
  * Una rama por funcionalidad o fix
  * Se eliminan después de mergear

### Flujo Visual

```
feature/nueva-funcionalidad
    ↓ (PR con Squash and Merge)
  dev
    ↓ (PR con Rebase and Merge)
  main (producción)
```

---

## 🤖 Automatización con Scripts

Hemos creado scripts para automatizar las tareas más comunes:

### Para Windows (PowerShell)

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

### Para Linux/Mac (Bash)

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

---

## 📝 Workflows Disponibles

Los workflows son guías paso a paso que puedes seguir. Están en `.agent/workflows/`:

### `/new-feature`
Crea una nueva feature branch desde `dev`.

**Uso:**
```bash
# El workflow te guiará para crear la rama
# Ejemplo: feature/login-social
```

### `/push-feature`
Sube tu feature branch y te guía para crear un PR a `dev`.

**Tipo de merge:** Squash and merge ✅

### `/create-pr-to-main`
Crea un PR de `dev` → `main` para desplegar a producción.

**Tipo de merge:** Rebase and merge ✅

### `/sync-after-merge`
Sincroniza tu repositorio local después de mergear un PR.

**Cuándo usar:**
- Después de mergear feature → dev
- Después de mergear dev → main

---

## 🔄 Flujo Completo Paso a Paso

### 1. Iniciar Nueva Feature

**Opción A: Con script (recomendado)**
```powershell
# Windows
.\scripts\git-flow.ps1 new-feature -Name "login-social"

# Linux/Mac
./scripts/git-flow.sh new-feature login-social
```

**Opción B: Manual**
```bash
git checkout dev
git pull origin dev
git checkout -b feature/login-social
```

---

### 2. Trabajar en la Feature

```bash
# Hacer cambios en tu código
git add .
git commit -m "feat: add social login with Google"

# Más cambios...
git add .
git commit -m "feat: add social login with GitHub"
```

---

### 3. Subir Feature y Crear PR

```bash
# Push de la feature
git push -u origin feature/login-social

# Crear PR en GitHub (manual o con GitHub CLI)
gh pr create --base dev --title "feat: Social login" --body "Implementa login con Google y GitHub"
```

**En GitHub:**
1. Ir a la página del repositorio
2. Crear Pull Request de `feature/login-social` → `dev`
3. Revisar cambios
4. Mergear con **"Squash and merge"** ✅

---

### 4. Sincronizar Después del Merge

**Opción A: Con script (recomendado)**
```powershell
# Windows
.\scripts\git-flow.ps1 sync

# Linux/Mac
./scripts/git-flow.sh sync
```

**Opción B: Manual**
```bash
git checkout dev
git fetch origin
git rebase origin/main
git push origin dev --force
git fetch origin main:main
```

---

### 5. Desplegar a Producción

Cuando `dev` esté listo para producción:

```bash
# Crear PR en GitHub
gh pr create --base main --head dev --title "Release: v1.2.0" --body "## Cambios\n- Feature 1\n- Feature 2"
```

**En GitHub:**
1. Crear Pull Request de `dev` → `main`
2. Revisar todos los cambios
3. Mergear con **"Rebase and merge"** ✅

**Después del merge:**
```powershell
# Sincronizar todo
.\scripts\git-flow.ps1 sync
```

---

### 6. Limpiar Feature Branches

Después de sincronizar, elimina las ramas locales mergeadas:

```bash
# Eliminar feature branch local
git branch -d feature/login-social

# Ver ramas locales
git branch
```

---

## ⚠️ Reglas Importantes

### 🚫 NUNCA Hacer

1. **NUNCA hacer checkout a `main` localmente**
   ```bash
   # ❌ NO HACER ESTO
   git checkout main
   git merge dev
   git push origin main
   ```

2. **NUNCA hacer commits directos en `dev` o `main`**
   - Siempre trabajar en feature/fix branches

3. **NUNCA hacer force push sin confirmar**
   - Solo hacer force push en `dev` después de sincronizar

### ✅ SIEMPRE Hacer

1. **SIEMPRE partir de `dev` actualizado**
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **SIEMPRE usar los tipos de merge correctos**
   - Feature → Dev: **Squash and merge**
   - Dev → Main: **Rebase and merge**

3. **SIEMPRE sincronizar después de mergear a `main`**
   ```bash
   .\scripts\git-flow.ps1 sync
   ```

4. **SIEMPRE usar nombres descriptivos**
   - ✅ `feature/login-social`
   - ✅ `fix/button-alignment`
   - ❌ `feature/test`
   - ❌ `fix/bug`

---

## 🎨 Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato (no afectan el código)
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

**Ejemplos:**
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update API documentation"
```

---

## 📊 Verificar Estado

En cualquier momento puedes verificar el estado:

```powershell
# Con script
.\scripts\git-flow.ps1 status

# Manual
git status
git branch -vv
git log --oneline --graph --all -8
```

---

## 🆘 Solución de Problemas

### Conflictos durante Rebase

```bash
# 1. Resolver conflictos en los archivos
# 2. Agregar archivos resueltos
git add .

# 3. Continuar rebase
git rebase --continue

# Si quieres cancelar el rebase
git rebase --abort
```

### Olvidaste Sincronizar

```bash
# No hay problema, simplemente ejecuta:
.\scripts\git-flow.ps1 sync
```

### Feature Branch Desactualizada

```bash
git checkout feature/mi-feature
git rebase dev
# Resolver conflictos si hay
git push --force-with-lease
```

---

## 🚀 Resumen Rápido

```bash
# 1. Nueva feature
.\scripts\git-flow.ps1 new-feature -Name "mi-feature"

# 2. Trabajar y commitear
git add .
git commit -m "feat: descripción"

# 3. Push y PR
git push -u origin feature/mi-feature
# Crear PR en GitHub: feature → dev (Squash and merge)

# 4. Sincronizar
.\scripts\git-flow.ps1 sync

# 5. Cuando dev esté listo
# Crear PR en GitHub: dev → main (Rebase and merge)

# 6. Sincronizar de nuevo
.\scripts\git-flow.ps1 sync
```

---

Este flujo mantiene el proyecto organizado, facilita el trabajo en equipo y asegura una producción estable. 🎉
