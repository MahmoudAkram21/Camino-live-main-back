@echo off
echo ========================================
echo Camino Database Setup Script
echo ========================================
echo.

REM Check if MySQL is in PATH
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] MySQL command not found!
    echo Please add MySQL to your PATH or use full path to mysql.exe
    echo Example: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
    pause
    exit /b 1
)

echo Step 1: Creating database...
echo.
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS camino_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create database!
    pause
    exit /b 1
)

echo.
echo Step 2: Running schema.sql...
echo.
mysql -u root -p camino_db -e "source database\schema.sql"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Trying alternative method...
    type database\schema.sql | mysql -u root -p camino_db
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to run schema.sql!
        echo.
        echo Please run this manually:
        echo mysql -u root -p camino_db
        echo Then type: source database\schema.sql
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Database setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Create .env file with database credentials
echo 2. Run: npm install
echo 3. Run: npm run seed
echo 4. Run: npm run dev
echo.
pause

