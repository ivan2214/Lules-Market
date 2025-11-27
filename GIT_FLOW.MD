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

Cuando la feature está lista, se hace **Pull Request hacia `dev`**.

---

## 4️⃣ Integrar `dev` en `main` (Producción)

Después de probar que todo en `dev` funciona y aprobado el PR:

```bash
git checkout main
git pull origin main
git merge --no-ff dev    # Mantener histórico de merges
git push origin main
```

> ⚠️ `--no-ff` asegura que los merges queden visibles en el historial.

---

## 5️⃣ Mantener ramas actualizadas

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

## 6️⃣ Resumen de ramas y flujo

* **main** → Producción, estable.
* **dev** → Integración, testeos antes de producción.
* **feature/** → Desarrollo de nuevas funcionalidades.

**Flujo típico:**

1. Crear feature desde dev
2. Hacer commits en feature
3. PR de feature → dev
4. Testear dev
5. PR de dev → main
6. Deploy a producción desde main

---

## 7️⃣ Consejos adicionales

* Usar nombres claros en las ramas: `feature/login`, `feature/cart`, `hotfix/bug-123`.
* Hacer commits pequeños y claros.
* Siempre actualizar tu rama antes de mergear: `git pull origin dev`.
* Mantener main limpia y estable, solo merges testeados desde dev.

---

Este flujo mantiene el proyecto organizado, facilita trabajo en equipo y asegura una producción estable.

