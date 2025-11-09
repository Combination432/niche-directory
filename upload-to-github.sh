#!/bin/bash

# GitHub Upload Script for Niche Directory
# This script will initialize git and push your project to GitHub

echo "🚀 GitHub Upload Script for Niche Directory"
echo "============================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   Windows: Download from https://git-scm.com/download/win"
    echo "   Mac: Run 'brew install git' or download from https://git-scm.com/download/mac"
    echo "   Linux: Run 'sudo apt-get install git' or 'sudo yum install git'"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " github_username

# Get repository name
read -p "Enter your repository name (default: niche-directory): " repo_name
repo_name=${repo_name:-niche-directory}

echo ""
echo "📋 Summary:"
echo "   GitHub Username: $github_username"
echo "   Repository Name: $repo_name"
echo "   Repository URL: https://github.com/$github_username/$repo_name"
echo ""

read -p "Is this correct? (y/n): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ Cancelled. Please run the script again."
    exit 1
fi

echo ""
echo "🔧 Setting up Git..."

# Initialize git if not already initialized
if [ ! -d .git ]; then
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/*.db
prisma/*.db-journal
EOF
    echo "✅ Created .gitignore"
fi

echo ""
echo "📦 Adding files to Git..."
git add .

echo ""
echo "💾 Creating commit..."
git commit -m "Initial commit: Complete niche directory application"

echo ""
echo "🔗 Setting up remote repository..."
git branch -M main
git remote remove origin 2>/dev/null  # Remove if exists
git remote add origin "https://github.com/$github_username/$repo_name.git"

echo ""
echo "🚀 Pushing to GitHub..."
echo ""
echo "⚠️  IMPORTANT: You may be prompted for your GitHub credentials."
echo "    If you have 2FA enabled, use a Personal Access Token instead of your password."
echo "    Create one at: https://github.com/settings/tokens"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your code is now on GitHub!"
    echo ""
    echo "📍 Your repository: https://github.com/$github_username/$repo_name"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Go to https://replit.com"
    echo "   2. Click 'Import code or design'"
    echo "   3. Paste: https://github.com/$github_username/$repo_name"
    echo "   4. Follow the setup instructions in QUICKSTART.md"
    echo ""
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   1. Repository doesn't exist on GitHub - Create it first at https://github.com/new"
    echo "   2. Wrong credentials - Make sure username/password are correct"
    echo "   3. Need Personal Access Token - If 2FA is enabled, use token instead of password"
    echo ""
    echo "After fixing, run: git push -u origin main"
fi
