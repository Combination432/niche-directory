# 🚀 Easy GitHub Upload Scripts

I've created two scripts to automatically upload your project to GitHub!

## 📋 Before You Start

### 1. Create the Repository on GitHub First
1. Go to https://github.com/new
2. Repository name: `niche-directory` (or any name you want)
3. **Keep it Public**
4. **Don't** initialize with README, .gitignore, or license
5. Click **"Create repository"**

### 2. Have Git Installed
- **Windows**: Download from https://git-scm.com/download/win
- **Mac**: Run `brew install git` or download from https://git-scm.com/download/mac
- **Linux**: Run `sudo apt-get install git`

---

## 🖥️ How to Use

### For Windows:
1. Extract the `niche-directory.zip` file
2. Open the `niche-directory` folder
3. **Double-click** `upload-to-github.bat`
4. Follow the prompts:
   - Enter your GitHub username
   - Enter repository name (or press Enter for default)
   - Confirm
   - Enter your GitHub password when prompted

### For Mac/Linux:
1. Extract the archive
2. Open Terminal
3. Navigate to the folder:
   ```bash
   cd path/to/niche-directory
   ```
4. Run the script:
   ```bash
   ./upload-to-github.sh
   ```
5. Follow the prompts

---

## 🔐 Authentication Notes

### If You Have 2FA (Two-Factor Authentication):

You **cannot** use your regular password. Instead:

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Replit Upload`
4. Select scopes: Check **"repo"** (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. When the script asks for password, **paste the token** instead

---

## ✅ After Upload Success

The script will show:
```
🎉 SUCCESS! Your code is now on GitHub!
📍 Your repository: https://github.com/YOUR-USERNAME/niche-directory
```

### Next Steps:
1. Go to https://replit.com
2. Click **"Import code or design"**
3. Choose **"GitHub"**
4. Paste your repository URL
5. Click **"Import"**
6. Follow the setup in `QUICKSTART.md`

---

## ❌ Troubleshooting

### "Repository not found"
- Make sure you created the repository on GitHub first
- Check that the repository name matches what you entered

### "Authentication failed"
- If you have 2FA, use a Personal Access Token (see above)
- Double-check your username and password
- Make sure there are no extra spaces

### "Permission denied"
- Make sure the repository is set to Public
- Or use a Personal Access Token with proper permissions

### Script won't run (Mac/Linux)
```bash
chmod +x upload-to-github.sh
./upload-to-github.sh
```

---

## 🎯 What the Script Does

1. ✅ Initializes Git in your folder
2. ✅ Creates/updates .gitignore file
3. ✅ Adds all your files
4. ✅ Creates a commit
5. ✅ Connects to your GitHub repository
6. ✅ Pushes everything to GitHub

All automatic! 🎉

---

## 💡 Manual Alternative

If the script doesn't work, you can do it manually:

```bash
cd niche-directory
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/niche-directory.git
git push -u origin main
```

---

Need help? Check the troubleshooting section above or try the manual method!
