# 📤 GitHub Push Instructions for PokeMMO Server

Follow these steps to push your PokeMMO server code to GitHub.

## Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** button in top-right corner
3. Select **"New repository"**
4. Configure your repository:
   - **Repository name**: `pokemmo-server` (or your preferred name)
   - **Description**: "Real-time multiplayer Pokemon MMO server with Solana blockchain integration"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README (we already have one)
   - **DO NOT** add .gitignore (we have one)
   - Click **"Create repository"**

## Step 2: Stage All Changes

Open terminal in your server directory and run:

```bash
# Add all new and modified files
git add .

# Verify what will be committed
git status
```

You should see all your files staged for commit (in green).

## Step 3: Create Commit

```bash
# Create a commit with all changes
git commit -m "🎮 PokeMMO server with Solana integration

- Real-time multiplayer game server using Colyseus
- Solana wallet authentication and rewards system
- Docker and cloud deployment configurations
- WebSocket support for real-time gameplay
- Token rewards for in-game activities"
```

## Step 4: Add GitHub Remote

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/pokemmo-server.git

# Verify remote was added
git remote -v
```

## Step 5: Push to GitHub

```bash
# Push to GitHub (first time)
git push -u origin master
```

If you're using `main` branch instead of `master`:
```bash
git branch -M main
git push -u origin main
```

## Step 6: Enter GitHub Credentials

When prompted:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (PAT), not your password

### Creating a Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: "PokeMMO Server Push"
4. Select scopes: `repo` (full control)
5. Click **"Generate token"**
6. Copy the token and use it as password

## Alternative: Push with GitHub CLI

If you have GitHub CLI installed:

```bash
# Install GitHub CLI (if not installed)
brew install gh  # macOS
# or download from https://cli.github.com

# Authenticate
gh auth login

# Create repo and push
gh repo create pokemmo-server --public --source=. --remote=origin --push
```

## Verify Upload

1. Go to `https://github.com/YOUR_USERNAME/pokemmo-server`
2. You should see all your files
3. README.md will be displayed on the main page

## Quick Commands Summary

```bash
# All in one (copy and run)
git add .
git commit -m "🎮 PokeMMO server with Solana integration"
git remote add origin https://github.com/YOUR_USERNAME/pokemmo-server.git
git push -u origin master
```

## Troubleshooting

### Issue: "remote origin already exists"
```bash
# Remove existing remote and re-add
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/pokemmo-server.git
```

### Issue: "Updates were rejected"
```bash
# Force push (use carefully)
git push -u origin master --force
```

### Issue: "Authentication failed"
- Make sure you're using a Personal Access Token, not password
- Check token has `repo` permissions
- Try using SSH instead of HTTPS

### Using SSH Instead (Alternative)
```bash
# Set SSH remote
git remote set-url origin git@github.com:YOUR_USERNAME/pokemmo-server.git

# Generate SSH key if needed
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add SSH key to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy output and add to GitHub Settings → SSH Keys
```

## After Pushing

### Enable GitHub Pages (Optional)
1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: master/main, folder: /root
4. Your docs will be at: `https://YOUR_USERNAME.github.io/pokemmo-server`

### Set Up Auto-Deploy to Render
1. Go to Render dashboard
2. Connect GitHub repository
3. Every push will auto-deploy!

### Add Topics to Repository
Go to repository main page → ⚙️ (gear icon) → Add topics:
- `colyseus`
- `solana`
- `web3`
- `multiplayer-game`
- `pokemon`
- `nodejs`
- `websocket`
- `blockchain`

## Next Steps

1. ✅ Code is now on GitHub
2. 🚀 Deploy to Render using GitHub integration
3. 📝 Update README with your actual GitHub username
4. 🔐 Never commit `.env` files with real keys
5. 🌟 Star your own repository!

## Success! 🎉

Your code is now on GitHub and ready for:
- Deployment to Render/Railway/Heroku
- Collaboration with other developers
- Version control and backup
- Showcase in your portfolio

Repository URL: `https://github.com/YOUR_USERNAME/pokemmo-server`