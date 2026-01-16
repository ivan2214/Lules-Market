---
description: Crear PR de dev a main
---

# Crear PR de Dev a Main

Este workflow te guía para crear un PR de `dev` → `main` cuando estés listo para desplegar a producción.

## Pre-requisitos

- Todos los PRs de features deben estar mergeados en `dev`
- `dev` debe estar testeado y estable
- Todos los tests deben pasar

## Pasos

// turbo
1. Asegurarse de estar en `dev` y actualizado:
```bash
git checkout dev
git pull origin dev
```

// turbo
2. Verificar el estado:
```bash
git status
git log --oneline -5
```

3. Crear PR usando GitHub CLI o manualmente:
```bash
gh pr create --base main --head dev --title "Release: DESCRIPCION" --body "## Cambios incluidos\n\n- Cambio 1\n- Cambio 2"
```

Si no tienes GitHub CLI, ve a GitHub y crea el PR manualmente.

## Tipo de Merge Recomendado

Cuando apruebes el PR en GitHub:
- **Dev → Main**: Usa **"Rebase and merge"** ✅

**¿Por qué Rebase and merge?**
- Mantiene un historial lineal y limpio
- Cada commit de `dev` se aplica individualmente a `main`
- Facilita el seguimiento de cambios

## Siguiente paso

Después de mergear el PR a `main`, usa el workflow `sync-after-merge` para sincronizar todo.
