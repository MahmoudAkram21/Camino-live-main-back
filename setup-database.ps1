# Camino Database Setup Script (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Camino Database Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is available
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlPath) {
    Write-Host "[ERROR] MySQL command not found!" -ForegroundColor Red
    Write-Host "Please add MySQL to your PATH or install MySQL" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can find MySQL at: C:\Program Files\MySQL\MySQL Server 8.0\bin\" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Step 1: Creating database..." -ForegroundColor Green
Write-Host ""

# Prompt for MySQL password
$securePassword = Read-Host "Enter MySQL root password" -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

# Create database
$createDbCommand = "CREATE DATABASE IF NOT EXISTS camino_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo $createDbCommand | & mysql -u root -p$password

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to create database!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Running schema.sql..." -ForegroundColor Green
Write-Host ""

# Run schema.sql
Get-Content "database\schema.sql" | & mysql -u root -p$password camino_db

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to run schema.sql!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create .env file with database credentials"
Write-Host "2. Run: npm install"
Write-Host "3. Run: npm run seed"
Write-Host "4. Run: npm run dev"
Write-Host ""
Read-Host "Press Enter to exit"

