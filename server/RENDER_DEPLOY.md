# 🚀 Render Deployment Guide for PokeMMO Server

This guide walks you through deploying your PokeMMO server with Solana integration on Render (with free tier option!).

## Why Render?

- ✅ **Free tier available** (750 hours/month)
- ✅ Automatic HTTPS/SSL
- ✅ WebSocket support
- ✅ Auto-deploy from GitHub
- ✅ Zero-config deployment with `render.yaml`

## Prerequisites

1. GitHub account (to host your code)
2. Render account (sign up free at https://render.com)
3. Solana wallet for treasury (optional for rewards)

---

## Method 1: Quick Deploy with GitHub (Recommended)

### Step 1: Push Code to GitHub

First, create a new GitHub repository:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial PokeMMO server with Solana integration"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/pokemmo-server.git

# Push to GitHub
git push -u origin master
```

### Step 2: Deploy on Render

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your `pokemmo-server` repository
5. Render will auto-detect the `render.yaml` file

### Step 3: Configure Service

If Render doesn't auto-detect settings, configure manually:

- **Name**: `pokemmo-server`
- **Region**: Oregon (USA West) or Frankfurt (Europe)
- **Branch**: `master` or `main`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Free (or Starter for $7/month for always-on)

### Step 4: Set Environment Variables

In the Render dashboard, go to **Environment** tab and add:

#### Required Variables:

| Key | Value | Notes |
|-----|-------|-------|
| `SOLANA_NETWORK` | `devnet` | Use `mainnet-beta` for production |
| `SOLANA_RPC_URL` | `https://api.devnet.solana.com` | Or your custom RPC |
| `TREASURY_PRIVATE_KEY` | Your wallet private key | Base58 format (keep secret!) |
| `JWT_SECRET` | Click "Generate" | Render will create a secure random value |

#### Optional Variables:

| Key | Value | Notes |
|-----|-------|-------|
| `GAME_TOKEN_MINT` | Token mint address | If using custom SPL token |
| `REWARD_PLAYER_JOIN` | `100000` | Join reward in lamports |
| `REWARD_MAP_CHANGE` | `50000` | Map change reward |
| `REWARD_BATTLE_WIN` | `500000` | Battle win reward |

### Step 5: Deploy

Click **"Create Web Service"** and wait for deployment (usually 2-5 minutes).

Your server will be available at: `https://pokemmo-server.onrender.com`

---

## Method 2: Deploy with Render CLI

### Step 1: Install Render CLI

```bash
# macOS with Homebrew
brew tap render-oss/render
brew install render

# Or download from
# https://github.com/render-oss/render-cli/releases
```

### Step 2: Login and Deploy

```bash
# Login to Render
render login

# Deploy using render.yaml
render up
```

---

## Method 3: Direct Git Deploy

### Step 1: Create Render Git Remote

```bash
# Add Render as git remote
git remote add render https://github.com/YOUR_USERNAME/pokemmo-server.git
```

### Step 2: Deploy via Git Push

```bash
# Push to Render
git push render master
```

---

## Testing Your Deployment

### Test Server Health:
```bash
curl https://pokemmo-server.onrender.com
```

### Test Colyseus Monitor:
Visit: `https://pokemmo-server.onrender.com/colyseus`

### Test Solana Integration:
```bash
# Check wallet balance endpoint
curl https://pokemmo-server.onrender.com/api/auth/wallet-balance/YOUR_WALLET_ADDRESS
```

### Test WebSocket Connection:
```javascript
// In browser console
const ws = new WebSocket('wss://pokemmo-server.onrender.com');
ws.onopen = () => console.log('Connected!');
```

---

## Setting Up Treasury Wallet

### For Testing (Devnet):

1. **Generate a new wallet:**
```bash
npx solana-keygen new --outfile treasury-wallet.json
```

2. **Get the private key in Base58:**
```bash
cat treasury-wallet.json | python3 -c "import json, base58, sys; print(base58.b58encode(bytes(json.load(sys.stdin))).decode())"
```

3. **Get free devnet SOL:**
```bash
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "requestAirdrop",
  "params": ["YOUR_WALLET_PUBLIC_KEY", 2000000000]
}'
```

### For Production (Mainnet):
- Use a hardware wallet (Ledger/Trezor)
- Never expose private keys in code
- Use Render's secret management

---

## Auto-Deploy from GitHub

### Enable Auto-Deploy:

1. In Render dashboard → **Settings**
2. Enable **"Auto-Deploy"** → Yes
3. Now every push to GitHub automatically deploys!

### GitHub Actions Integration (Optional):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main, master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        env:
          deploy_url: ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
        run: |
          curl "$deploy_url"
```

Get deploy hook URL from Render dashboard → Settings → Deploy Hook.

---

## Custom Domain Setup

1. In Render dashboard → **Settings** → **Custom Domains**
2. Add your domain: `game.yourdomain.com`
3. Add CNAME record in your DNS:
   ```
   CNAME game.yourdomain.com → pokemmo-server.onrender.com
   ```
4. Render automatically provisions SSL certificate

---

## Monitoring & Logs

### View Logs:
- Dashboard → **Logs** tab
- Or use CLI: `render logs pokemmo-server`

### Monitor Performance:
- Dashboard → **Metrics** tab
- Shows CPU, Memory, and Network usage

### Set Up Alerts:
1. Go to **Settings** → **Notifications**
2. Add email/Slack/Discord webhooks
3. Get notified on deploy failures or downtime

---

## Scaling Your Server

### Free Tier Limitations:
- Spins down after 15 minutes of inactivity
- 750 hours/month (enough for 1 service 24/7)
- Limited CPU/Memory

### Upgrade to Paid Plans:

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 750 hrs/month, spins down |
| **Starter** | $7/mo | Always on, 512 MB RAM |
| **Standard** | $25/mo | 2 GB RAM, better CPU |
| **Pro** | $85/mo | 4 GB RAM, dedicated resources |

To upgrade:
1. Dashboard → **Settings** → **Change Plan**
2. Select new plan
3. No downtime during upgrade

---

## Troubleshooting

### Issue: "Service failed to deploy"
```bash
# Check build logs
render logs pokemmo-server --type build

# Common fixes:
# - Ensure all dependencies are in "dependencies" not "devDependencies"
# - Check Node version matches (18+)
```

### Issue: "WebSocket connection failed"
- Render supports WebSockets on all plans
- Ensure client uses `wss://` not `ws://`
- Check CORS settings in server.js

### Issue: "Service spinning down"
- Normal on free tier after 15 min inactivity
- Upgrade to Starter ($7/mo) for always-on
- Or use external ping service to keep alive

### Issue: "Environment variables not working"
- Redeploy after adding variables
- Check for typos in variable names
- Use Render dashboard, not render.yaml for secrets

### Issue: "Port binding failed"
```javascript
// Ensure your server.js uses:
const port = process.env.PORT || 3000;
// Render assigns PORT automatically
```

---

## Production Checklist

- [ ] Switch to `mainnet-beta` for SOLANA_NETWORK
- [ ] Use production Solana RPC (Helius, QuickNode)
- [ ] Secure treasury wallet with hardware wallet
- [ ] Enable auto-deploy from main branch only
- [ ] Set up custom domain with SSL
- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Upgrade to paid plan for production traffic
- [ ] Enable DDoS protection (Cloudflare)
- [ ] Set up database backups if using one

---

## Cost Optimization

### Free Tier Tips:
- Use for development/testing
- Combine with Cloudflare for caching
- Use external cron to prevent spin-down

### When to Upgrade:
- More than 100 concurrent players → Starter
- More than 500 concurrent players → Standard
- More than 2000 concurrent players → Pro

---

## Useful Commands

```bash
# View service info
render services list

# Stream logs
render logs pokemmo-server --tail

# Restart service
render restart pokemmo-server

# Update environment variable
render env set VARIABLE_NAME=value

# SSH into service (paid plans only)
render ssh pokemmo-server
```

---

## Support Resources

- **Render Status**: https://status.render.com
- **Render Docs**: https://render.com/docs
- **Community Forum**: https://community.render.com
- **Discord**: https://discord.gg/render

---

## Next Steps

1. ✅ Server deployed at `https://pokemmo-server.onrender.com`
2. 🎮 Update game client to connect to Render URL
3. 📊 Monitor logs and performance
4. 🚀 Scale up as player base grows
5. 💰 Monitor Solana treasury balance

**Congratulations! Your PokeMMO server is now live on Render!** 🎉

---

## Quick Reference

### Server URL Format:
- HTTP API: `https://pokemmo-server.onrender.com`
- WebSocket: `wss://pokemmo-server.onrender.com`
- Colyseus: `wss://pokemmo-server.onrender.com`

### Important Endpoints:
- Health: `GET /`
- Colyseus Monitor: `GET /colyseus`
- Wallet Auth: `POST /api/auth/wallet-connect`
- Check Balance: `GET /api/auth/wallet-balance/:address`

### Client Connection Example:
```javascript
import * as Colyseus from "colyseus.js";

const client = new Colyseus.Client('wss://pokemmo-server.onrender.com');
const room = await client.joinOrCreate("poke_world");
```