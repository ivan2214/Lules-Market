
# Gitflow - Flujo de trabajo recomendado

Este documento describe un flujo de trabajo Gitflow simple y efectivo para equipos de desarrollo, ideal para mantener un proyecto limpio, organizado y con producción estable.

---

## 1️⃣ Clonar el repositorio desde cero

Si perdiste tu carpeta `.git` o querés empezar limpio:

```bash
# Clonamos solo la última versión de main (sin historial antiguo)
git clone --depth=1 https://github.com/ivan2214/Lules-Market.git
cd Lules-Market
````

---

## 2️⃣ Crear la rama de desarrollo `dev`

* `main` → rama de producción
* `dev` → rama de integración de cambios antes de pasar a producción

```bash
git checkout -b dev      # Crear rama dev local
git push -u origin dev   # Subir al remoto y establecer upstream
```

---

## 3️⃣ Crear ramas de features

Para cualquier nueva funcionalidad, creamos una rama a partir de `dev`:

```bash
git checkout dev
git checkout -b feature/nombre-de-la-feature
```

Trabajás en la feature y haces commits normalmente:

```bash
git add .
git commit -m "feat: descripción del cambio"
git push -u origin feature/nombre-de-la-feature
```

---

## 4️⃣ Pull Requests (PR) y tipo de merge

Cuando la feature está lista, se hace **Pull Request hacia `dev`**:

* **Feature → Dev:**

  * **Merge recomendado:** `Squash and merge` ✅
  * **Por qué:** mantiene `dev` limpia, un commit por feature, evita commits intermedios sucios.

Cuando dev está estable y testeada, se hace **PR de `dev` → `main`**:

* **Dev → Main:**

  * **Merge recomendado:** `Create a merge commit (--no-ff)` ✅
  * **Por qué:** mantiene histórico de todas las features integradas, reflejando exactamente cuándo dev se pasó a producción.

> 💡 Tip: Antes de abrir un PR, actualizá tu rama:

```bash
git checkout dev
git pull origin dev

git checkout feature/nombre-de-la-feature
git merge dev
```

Esto evita conflictos grandes y asegura que la rama esté lista para merge.

---

## 5️⃣ Integrar `dev` en `main` (Producción)

Después de aprobar el PR de dev → main:

```bash
git checkout main
git pull origin main
git merge --no-ff dev    # Mantener histórico de merges
git push origin main
```

---

## 6️⃣ Mantener ramas actualizadas

Cada vez que trabajes:

```bash
# Actualizar dev con cambios remotos
git checkout dev
git pull origin dev

# Actualizar feature con dev
git checkout feature/nombre-de-la-feature
git merge dev
```

Esto evita conflictos grandes y mantiene el código limpio.

---

## 7️⃣ Resumen de ramas y flujo

* **main** → Producción, estable.
* **dev** → Integración, testeos antes de producción.
* **feature/** → Desarrollo de nuevas funcionalidades.

**Flujo típico:**

1. Crear feature desde dev
2. Hacer commits en feature
3. PR de feature → dev (**Squash and merge**)
4. Testear dev
5. PR de dev → main (**Merge commit --no-ff**)
6. Deploy a producción desde main

---

## 8️⃣ Consejos adicionales

* Usar nombres claros en las ramas: `feature/login`, `feature/cart`, `hotfix/bug-123`.
* Hacer commits pequeños y claros.
* Siempre actualizar tu rama antes de mergear: `git pull origin dev`.
* Mantener main limpia y estable, solo merges testeados desde dev.

---

Este flujo mantiene el proyecto organizado, facilita trabajo en equipo y asegura una producción estable.

