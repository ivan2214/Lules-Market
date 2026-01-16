---
description: Sincronizar después de mergear PR
---

# Sincronizar Después de Merge

Este workflow sincroniza tu repositorio local después de mergear un PR en GitHub.

## Cuándo usar

- Después de mergear un PR de **feature → dev** en GitHub
- Después de mergear un PR de **dev → main** en GitHub

## Pasos

// turbo
1. Cambiar a la rama `dev`:
```bash
git checkout dev
```

// turbo
2. Obtener los últimos cambios del remoto:
```bash
git fetch origin
```

// turbo
3. Hacer rebase con `origin/main` (esto sincroniza dev con main):
```bash
git rebase origin/main
```

// turbo
4. Actualizar `origin/dev` con force push:
```bash
git push origin dev --force
```

// turbo
5. Actualizar la referencia local de `main` sin hacer checkout:
```bash
git fetch origin main:main
```

// turbo
6. Verificar que todo está sincronizado:
```bash
git status
git log --oneline --graph --all -5
```

## Resultado Esperado

Todas las ramas deberían apuntar al mismo commit:
- `dev` (local)
- `main` (local)
- `origin/dev`
- `origin/main`

## Limpiar Feature Branches

Después de sincronizar, puedes eliminar la feature branch local si ya fue mergeada:

```bash
git branch -d feature/NOMBRE_DE_LA_FEATURE
```
