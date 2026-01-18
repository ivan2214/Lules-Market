# GIT FLOW
Este documento describe el flujo de trabajo para el proyecto Lules Market.

# 1. Siempre empezar sincronizado
git switch dev
git pull

# 2. Crear feature branch
git switch -c feat/nombre-de-feature

# 3. Trabajar y hacer commits
git add .
git commit -m "feat: descripción del cambio"

# 4. Subir la rama
git push -u origin feat/nombre-de-feature

# 5. Crear PR en GitHub: feat/nombre-de-feature → dev
#    (Aceptar con "Rebase and merge")

# 6. Volver a dev y sincronizar
git switch dev
git pull

# 7. Crear PR en GitHub: dev → main
#    (Aceptar con "Rebase and merge")

# 8. Sincronizar dev otra vez
git pull

# 9. Repetir desde paso 2 🔄