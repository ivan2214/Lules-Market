#!/bin/bash
# Git Flow Automation Script para Bash/Zsh
# Este script automatiza el flujo de trabajo GitFlow del proyecto

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funciones de utilidad
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función para crear nueva feature
new_feature() {
    local feature_name=$1
    
    if [ -z "$feature_name" ]; then
        error "Debes proporcionar un nombre para la feature"
        info "Uso: ./scripts/git-flow.sh new-feature nombre-de-la-feature"
        exit 1
    fi
    
    info "Creando nueva feature: $feature_name"
    
    # Cambiar a dev
    info "Cambiando a rama dev..."
    git checkout dev
    
    # Actualizar dev
    info "Actualizando dev desde origin..."
    git pull origin dev
    
    # Crear feature branch
    local branch_name="feature/$feature_name"
    info "Creando rama $branch_name..."
    git checkout -b "$branch_name"
    
    success "Feature branch '$branch_name' creada exitosamente!"
    info "Ahora puedes hacer tus cambios y commits"
    info "Cuando termines, usa: git push -u origin $branch_name"
}

# Función para crear nuevo fix
new_fix() {
    local fix_name=$1
    
    if [ -z "$fix_name" ]; then
        error "Debes proporcionar un nombre para el fix"
        info "Uso: ./scripts/git-flow.sh new-fix nombre-del-fix"
        exit 1
    fi
    
    info "Creando nuevo fix: $fix_name"
    
    # Cambiar a dev
    info "Cambiando a rama dev..."
    git checkout dev
    
    # Actualizar dev
    info "Actualizando dev desde origin..."
    git pull origin dev
    
    # Crear fix branch
    local branch_name="fix/$fix_name"
    info "Creando rama $branch_name..."
    git checkout -b "$branch_name"
    
    success "Fix branch '$branch_name' creada exitosamente!"
    info "Ahora puedes hacer tus cambios y commits"
    info "Cuando termines, usa: git push -u origin $branch_name"
}

# Función para sincronizar después de merge
sync_after_merge() {
    info "Sincronizando repositorio después de merge..."
    
    # Cambiar a dev
    info "Cambiando a rama dev..."
    git checkout dev
    
    # Fetch
    info "Obteniendo cambios del remoto..."
    git fetch origin
    
    # Rebase con origin/main
    info "Haciendo rebase con origin/main..."
    if ! git rebase origin/main; then
        error "Error al hacer rebase. Puede que tengas conflictos."
        info "Resuelve los conflictos y ejecuta: git rebase --continue"
        exit 1
    fi
    
    # Force push a origin/dev
    info "Actualizando origin/dev..."
    git push origin dev --force
    
    # Actualizar main local
    info "Actualizando referencia local de main..."
    git fetch origin main:main
    
    success "Sincronización completada!"
    info "Estado actual:"
    git status
    git log --oneline --graph --all -5
}

# Función para mostrar estado
show_status() {
    info "Estado del repositorio:"
    echo ""
    
    # Rama actual
    local current_branch=$(git branch --show-current)
    echo -e "📍 Rama actual: ${YELLOW}$current_branch${NC}"
    echo ""
    
    # Estado de las ramas
    echo -e "${CYAN}🌿 Estado de las ramas:${NC}"
    git branch -vv
    echo ""
    
    # Últimos commits
    echo -e "${CYAN}📝 Últimos commits:${NC}"
    git log --oneline --graph --all -8
    echo ""
    
    # Estado del working tree
    echo -e "${CYAN}📊 Working tree:${NC}"
    git status
}

# Menú principal
case "$1" in
    new-feature)
        new_feature "$2"
        ;;
    new-fix)
        new_fix "$2"
        ;;
    sync)
        sync_after_merge
        ;;
    status)
        show_status
        ;;
    *)
        error "Comando no reconocido: $1"
        echo ""
        info "Comandos disponibles:"
        echo "  new-feature <nombre>  - Crear nueva feature branch"
        echo "  new-fix <nombre>      - Crear nueva fix branch"
        echo "  sync                  - Sincronizar después de merge"
        echo "  status                - Mostrar estado del repositorio"
        echo ""
        info "Ejemplos:"
        echo "  ./scripts/git-flow.sh new-feature mi-nueva-feature"
        echo "  ./scripts/git-flow.sh new-fix corregir-bug"
        echo "  ./scripts/git-flow.sh sync"
        echo "  ./scripts/git-flow.sh status"
        exit 1
        ;;
esac
