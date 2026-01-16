---
description: Crear una nueva feature branch desde dev
---

# Crear Nueva Feature

Este workflow automatiza la creación de una nueva feature branch desde `dev`.

## Pasos

// turbo
1. Asegurarse de estar en la rama `dev`:
```bash
git checkout dev
```

// turbo
2. Actualizar `dev` con los últimos cambios:
```bash
git pull origin dev
```

3. Crear la nueva feature branch (el usuario debe proporcionar el nombre):
```bash
git checkout -b feature/NOMBRE_DE_LA_FEATURE
```

4. Confirmar la creación:
```bash
git status
```

## Siguiente paso

Después de hacer tus cambios, usa el workflow `push-feature` para subir los cambios a GitHub.
