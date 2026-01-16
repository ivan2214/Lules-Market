---
description: Push feature branch y crear PR a dev
---

# Push Feature y Crear PR

Este workflow sube tu feature branch a GitHub y te guía para crear un PR hacia `dev`.

## Pasos

// turbo
1. Verificar el estado actual:
```bash
git status
```

2. Agregar todos los cambios:
```bash
git add .
```

3. Hacer commit (el usuario debe proporcionar el mensaje):
```bash
git commit -m "MENSAJE_DEL_COMMIT"
```

// turbo
4. Push de la feature branch:
```bash
git push -u origin HEAD
```

5. Crear PR usando GitHub CLI (si está disponible) o manualmente:
```bash
gh pr create --base dev --title "TITULO_DEL_PR" --body "DESCRIPCION"
```

Si no tienes GitHub CLI instalado, el comando anterior mostrará la URL para crear el PR manualmente.

## Tipo de Merge Recomendado

Cuando apruebes el PR en GitHub:
- **Feature → Dev**: Usa **"Squash and merge"** ✅

## Siguiente paso

Después de mergear el PR, usa el workflow `sync-after-merge` para sincronizar tu repositorio local.
