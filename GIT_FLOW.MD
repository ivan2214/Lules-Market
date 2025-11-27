# **gitflow.md**

# 🌀 Git Flow – Dev Local + Main Producción

Este proyecto usa un flujo limpio y seguro:

* **Local:** solo `dev` y ramas de feature (`feat/*`, `fix/*`, `chore/*`)
* **Remoto:** `main` (producción) y ramas temporales de feature (se borran después del merge)

Producción (`main`) **nunca se toca desde local**. Todo pasa por `dev`.

---

## 🌳 Ramas

| Rama     | Local / Remoto | Uso                                                                         |
| -------- | -------------- | --------------------------------------------------------------------------- |
| `dev`    | Local          | Base de trabajo. Contiene todos los cambios listos para producción.         |
| `feat/*` | Local / Remoto | Ramas temporales para nuevas funcionalidades o fixes. Se crean desde `dev`. |
| `main`   | Remoto         | Producción. Solo se actualiza vía PR desde `dev`.                           |

---

## 🔄 Flujo de trabajo

### 1️⃣ Mantener `dev` sincronizada con producción

```bash
git fetch origin
git switch dev
git rebase origin/main
```

### 2️⃣ Crear una feature desde `dev`

```bash
git switch dev
git switch -c feat/mi-feature
```

* Hacer commits normalmente.

### 3️⃣ Mantener la feature actualizada antes del PR

```bash
git fetch origin
git rebase dev
```

### 4️⃣ PR: feature → dev

* Subir la feature al remoto:

```bash
git push origin feat/mi-feature
```

* Abrir PR **feat/mi-feature → dev** en GitHub.
* Usar **Rebase and Merge**.
* Borrar la rama feature remota después del merge.

### 5️⃣ Actualizar `dev` local

```bash
git fetch origin
git switch dev
git rebase origin/dev
```

### 6️⃣ PR: dev → main

* Abrir PR **dev → main** en GitHub cuando todo en dev está listo para producción.
* Usar **Rebase and Merge**.
* Producción se actualiza solo después del merge.
* **No se toca main local.**

### 7️⃣ Volver a empezar

* Mantener `dev` al día:

```bash
git fetch origin
git switch dev
git rebase origin/main
```

* Crear nuevas features desde `dev`.

---

## 🔹 Esquema visual

```
LOCAL:                      REMOTO:

dev -----------------------> main (producción)
  \
   \-> feat/x -> PR -> dev
                 \
                  -> PR -> main
```

---

## ⚡ Reglas clave

* Producción (`main`) solo se actualiza vía PR desde `dev`.
* No tener main local es totalmente válido.
* Todas las ramas feature deben crearse desde `dev`.
* Merge commits locales NO se usan; siempre **Rebase & Merge** en GitHub.
* Ramas feature se borran después del merge.

