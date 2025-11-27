# Flujo de trabajo con Git para este proyecto

Este documento describe el flujo recomendado de trabajo con Git y GitHub para mantener un historial limpio, lineal y fácil de seguir. Usamos **Rebase and Merge** para los PRs.

---

## 1️⃣ Configuración inicial

Antes de crear cualquier rama de trabajo:

```bash
# Cambiar a main
git switch main

# Traer los últimos cambios del remoto
git pull
````

Esto asegura que tu rama principal local esté actualizada.

---

## 2️⃣ Crear una rama de feature

Siempre crea ramas nuevas desde `main` actualizado:

```bash
git switch -c nombre-de-la-rama
```

**Ejemplo:**

```bash
git switch -c ci/add-build-caching
```

* Usa nombres descriptivos y en formato `tipo/descripcion` (`feature/login`, `fix/button-style`, etc.)
* Haz commits pequeños y claros con mensajes descriptivos.

---

## 3️⃣ Trabajar en la rama de feature

* Haz commits pequeños, significativos y autocontenidos:

```bash
git add .
git commit -m "feat: agregar caching al build"
```

* Actualiza tu rama con cambios recientes de main antes de abrir el PR (opcional pero recomendado):

```bash
git switch main
git pull
git switch nombre-de-la-rama
git rebase main
```

* Si hay conflictos:

```bash
# Resolver conflictos en archivos
git add archivo-resuelto
git rebase --continue
```

* Empuja la rama al remoto:

```bash
git push origin nombre-de-la-rama --force
```

> Solo se usa `--force` después de un rebase para sincronizar con remoto.

---

## 4️⃣ Abrir un Pull Request (PR)

* Ve a GitHub y abre un PR desde tu rama hacia `main`.
* Usar la opción **Rebase and Merge**:

  * Mantiene commits individuales.
  * Deja un historial lineal.
* No usar “Create a merge commit” para mantener historial limpio.
* Solo usar **Squash and Merge** si queremos un único commit por feature.

---

## 5️⃣ Después de mergear el PR

1. Cambiar a `main` local y actualizar:

```bash
git switch main
git pull
```

2. Borrar la rama de feature:

```bash
# Local
git branch -d nombre-de-la-rama

# Remoto
git push origin --delete nombre-de-la-rama
```

3. Prepararse para la próxima feature:

```bash
git switch main
git pull
git switch -c nueva-feature
```

---

## 6️⃣ Resumen rápido del flujo

1. `git switch main && git pull` → asegurarte que main esté actualizado.
2. `git switch -c rama-feature` → crear y moverse a la rama de trabajo.
3. Trabajar en commits pequeños.
4. Opcional: `git rebase main` antes de PR.
5. Abrir PR → **Rebase and Merge**.
6. `git switch main && git pull` → actualizar main local.
7. Borrar rama feature local y remoto.
8. Crear nueva rama desde main actualizado.

