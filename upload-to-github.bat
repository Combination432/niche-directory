@echo off
REM GitHub Upload Script for Niche Directory (Windows)
REM This script will initialize git and push your project to GitHub

echo.
echo ========================================
echo   GitHub Upload Script
echo   Niche Directory
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Get GitHub username
set /p github_username="Enter your GitHub username: "

REM Get repository name
set /p repo_name="Enter repository name (default: niche-directory): "
if "%repo_name%"=="" set repo_name=niche-directory

echo.
echo ========================================
echo Summary:
echo   GitHub Username: %github_username%
echo   Repository Name: %repo_name%
echo   Repository URL: https://github.com/%github_username%/%repo_name%
echo ========================================
echo.

set /p confirm="Is this correct? (y/n): "
if /i not "%confirm%"=="y" (
    echo.
    echo Cancelled. Please run the script again.
    pause
    exit /b 1
)

echo.
echo Setting up Git...

REM Initialize git if not already initialized
if not exist .git (
    git init
    echo [OK] Git initialized
) else (
    echo [OK] Git already initialized
)

echo.
echo Adding files to Git...
git add .

echo.
echo Creating commit...
git commit -m "Initial commit: Complete niche directory application"

echo.
echo Setting up remote repository...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/%github_username%/%repo_name%.git

echo.
echo ========================================
echo IMPORTANT: You may be prompted for credentials
echo.
echo If you have 2FA enabled on GitHub:
echo   - Use a Personal Access Token instead of password
echo   - Create one at: https://github.com/settings/tokens
echo ========================================
echo.
echo Pushing to GitHub...
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Your code is now on GitHub!
    echo ========================================
    echo.
    echo Repository: https://github.com/%github_username%/%repo_name%
    echo.
    echo Next steps:
    echo   1. Go to https://replit.com
    echo   2. Click 'Import code or design'
    echo   3. Paste: https://github.com/%github_username%/%repo_name%
    echo   4. Follow setup instructions in QUICKSTART.md
    echo.
) else (
    echo.
    echo ========================================
    echo Push failed! Common issues:
    echo ========================================
    echo   1. Repository doesn't exist on GitHub
    echo      - Create it first at: https://github.com/new
    echo.
    echo   2. Wrong credentials
    echo      - Double-check username and password
    echo.
    echo   3. Need Personal Access Token
    echo      - If 2FA is enabled, use token instead
    echo      - Create at: https://github.com/settings/tokens
    echo.
    echo After fixing, run: git push -u origin main
    echo.
)

pause
