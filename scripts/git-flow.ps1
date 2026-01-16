# Git Flow Automation Script para PowerShell
# Este script automatiza el flujo de trabajo GitFlow del proyecto

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('new-feature', 'new-fix', 'sync', 'status')]
    [string]$Command,
    
    [Parameter(Mandatory=$false)]
    [string]$Name
)

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function New-Feature {
    param([string]$FeatureName)
    
    if (-not $FeatureName) {
        Write-Error "Debes proporcionar un nombre para la feature"
        Write-Info "Uso: .\scripts\git-flow.ps1 new-feature -Name 'nombre-de-la-feature'"
        exit 1
    }
    
    Write-Info "Creando nueva feature: $FeatureName"
    
    # Cambiar a dev
    Write-Info "Cambiando a rama dev..."
    git checkout dev
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al cambiar a rama dev"
        exit 1
    }
    
    # Actualizar dev
    Write-Info "Actualizando dev desde origin..."
    git pull origin dev
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al actualizar dev"
        exit 1
    }
    
    # Crear feature branch
    $branchName = "feature/$FeatureName"
    Write-Info "Creando rama $branchName..."
    git checkout -b $branchName
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al crear la rama"
        exit 1
    }
    
    Write-Success "Feature branch '$branchName' creada exitosamente!"
    Write-Info "Ahora puedes hacer tus cambios y commits"
    Write-Info "Cuando termines, usa: git push -u origin $branchName"
}

function New-Fix {
    param([string]$FixName)
    
    if (-not $FixName) {
        Write-Error "Debes proporcionar un nombre para el fix"
        Write-Info "Uso: .\scripts\git-flow.ps1 new-fix -Name 'nombre-del-fix'"
        exit 1
    }
    
    Write-Info "Creando nuevo fix: $FixName"
    
    # Cambiar a dev
    Write-Info "Cambiando a rama dev..."
    git checkout dev
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al cambiar a rama dev"
        exit 1
    }
    
    # Actualizar dev
    Write-Info "Actualizando dev desde origin..."
    git pull origin dev
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al actualizar dev"
        exit 1
    }
    
    # Crear fix branch
    $branchName = "fix/$FixName"
    Write-Info "Creando rama $branchName..."
    git checkout -b $branchName
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al crear la rama"
        exit 1
    }
    
    Write-Success "Fix branch '$branchName' creada exitosamente!"
    Write-Info "Ahora puedes hacer tus cambios y commits"
    Write-Info "Cuando termines, usa: git push -u origin $branchName"
}

function Sync-AfterMerge {
    Write-Info "Sincronizando repositorio después de merge..."
    
    # Cambiar a dev
    Write-Info "Cambiando a rama dev..."
    git checkout dev
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al cambiar a rama dev"
        exit 1
    }
    
    # Fetch
    Write-Info "Obteniendo cambios del remoto..."
    git fetch origin
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al hacer fetch"
        exit 1
    }
    
    # Rebase con origin/main
    Write-Info "Haciendo rebase con origin/main..."
    git rebase origin/main
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al hacer rebase. Puede que tengas conflictos."
        Write-Info "Resuelve los conflictos y ejecuta: git rebase --continue"
        exit 1
    }
    
    # Force push a origin/dev
    Write-Info "Actualizando origin/dev..."
    git push origin dev --force
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al hacer push"
        exit 1
    }
    
    # Actualizar main local
    Write-Info "Actualizando referencia local de main..."
    git fetch origin main:main
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Error al actualizar main local"
        exit 1
    }
    
    Write-Success "Sincronización completada!"
    Write-Info "Estado actual:"
    git status
    git log --oneline --graph --all -5
}

function Show-Status {
    Write-Info "Estado del repositorio:"
    Write-Host ""
    
    # Rama actual
    $currentBranch = git branch --show-current
    Write-Host "📍 Rama actual: " -NoNewline
    Write-Host "$currentBranch" -ForegroundColor Yellow
    Write-Host ""
    
    # Estado de las ramas
    Write-Host "🌿 Estado de las ramas:" -ForegroundColor Cyan
    git branch -vv
    Write-Host ""
    
    # Últimos commits
    Write-Host "📝 Últimos commits:" -ForegroundColor Cyan
    git log --oneline --graph --all -8
    Write-Host ""
    
    # Estado del working tree
    Write-Host "📊 Working tree:" -ForegroundColor Cyan
    git status
}

# Ejecutar comando
switch ($Command) {
    'new-feature' { New-Feature -FeatureName $Name }
    'new-fix' { New-Fix -FixName $Name }
    'sync' { Sync-AfterMerge }
    'status' { Show-Status }
}
