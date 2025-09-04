# 🚂 Railway Deployment Guide for PokeMMO Server

This guide will walk you through deploying your PokeMMO server with Solana integration on Railway.

## Prerequisites

Before deploying, you need:
1. A Railway account (sign up at https://railway.app)
2. A funded Solana wallet for rewards (devnet for testing, mainnet for production)
3. Git installed on your machine

## Step 1: Install Railway CLI

### macOS/Linux:
```bash
curl -fsSL https://railway.app/install.sh | sh
```

### Windows:
```bash
npm install -g @railway/cli
```

### Verify installation:
```bash
railway --version
```

## Step 2: Login to Railway

```bash
railway login
```

This will open your browser for authentication.

## Step 3: Initialize Railway Project

Navigate to your server directory:
```bash
cd /Users/hieuho/PokeMMO-Online-Realtime-Multiplayer-Game/server
```

Initialize a new Railway project:
```bash
railway init
```

Choose:
- "Empty Project" when prompted
- Give your project a name like "pokemmo-server"

## Step 4: Deploy to Railway

Deploy your code:
```bash
railway up
```

This will upload and deploy your server. Wait for the deployment to complete.

## Step 5: Set Environment Variables

### Option A: Using CLI (Recommended)

Set all required environment variables:

```bash
# Solana Configuration
railway variables set SOLANA_NETWORK=devnet
railway variables set SOLANA_RPC_URL=https://api.devnet.solana.com

# Treasury Wallet (IMPORTANT: Replace with your actual private key)
railway variables set TREASURY_PRIVATE_KEY=your-base58-private-key-here

# Security
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Rewards (in lamports)
railway variables set REWARD_PLAYER_JOIN=100000
railway variables set REWARD_MAP_CHANGE=50000
railway variables set REWARD_BATTLE_WIN=500000

# Optional: If you have a custom SPL token
# railway variables set GAME_TOKEN_MINT=your-token-mint-address
```

### Option B: Using Railway Dashboard

1. Go to https://railway.app/dashboard
2. Click on your project
3. Go to "Variables" tab
4. Add each variable manually:
   - `SOLANA_NETWORK` = `devnet` (or `mainnet-beta` for production)
   - `SOLANA_RPC_URL` = `https://api.devnet.solana.com`
   - `TREASURY_PRIVATE_KEY` = Your wallet's private key
   - `JWT_SECRET` = A strong random string
   - `REWARD_PLAYER_JOIN` = `100000`
   - `REWARD_MAP_CHANGE` = `50000`
   - `REWARD_BATTLE_WIN` = `500000`

## Step 6: Generate Public URL

Railway will automatically generate a public URL for your service:

```bash
railway domain
```

If no domain exists, generate one:
```bash
railway domain generate
```

Your server will be available at something like: `https://pokemmo-server-production.up.railway.app`

## Step 7: Monitor Your Deployment

### View logs:
```bash
railway logs
```

### Open Railway dashboard:
```bash
railway open
```

## Step 8: Test Your Deployment

Test the server is running:
```bash
curl https://your-app.up.railway.app/colyseus
```

Test Solana integration:
```bash
curl https://your-app.up.railway.app/api/auth/wallet-balance/YourWalletAddress
```

## Setting Up Your Treasury Wallet

### For Testing (Devnet):

1. Create a new wallet:
```bash
npm install -g @solana/web3.js
node -e "const { Keypair } = require('@solana/web3.js'); const kp = Keypair.generate(); console.log('Public Key:', kp.publicKey.toString()); console.log('Private Key (Base58):', Buffer.from(kp.secretKey).toString('base64'));"
```

2. Get free devnet SOL:
```bash
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "requestAirdrop",
  "params": ["YOUR_WALLET_PUBLIC_KEY", 1000000000]
}'
```

### For Production (Mainnet):
- Use a secure wallet (Phantom, Solflare, etc.)
- Export private key carefully
- Fund with real SOL based on expected reward distribution

## Updating Your Deployment

When you make code changes:

```bash
# Commit your changes
git add .
git commit -m "Update server"

# Deploy updates
railway up
```

## Useful Railway Commands

```bash
# View all variables
railway variables

# Remove a variable
railway variables remove VARIABLE_NAME

# Restart service
railway restart

# View deployment status
railway status

# Connect to database (if using Railway PostgreSQL)
railway connect postgres
```

## Monitoring & Debugging

### View Real-time Logs:
```bash
railway logs -f
```

### Check Service Health:
Visit: `https://your-app.up.railway.app/colyseus`

### Monitor Colyseus Admin:
Visit: `https://your-app.up.railway.app/colyseus`

## Cost Management

Railway pricing (as of 2024):
- **Hobby Plan**: $5/month (includes $5 of usage)
- **Usage**: ~$0.000463/GB RAM/hour
- **Estimated cost**: $5-20/month for a game server

Monitor usage in Railway dashboard under "Usage" tab.

## Troubleshooting

### Issue: "Port not detected"
Railway automatically detects PORT from your code. Ensure your server.js uses:
```javascript
const port = process.env.PORT || 3000;
```

### Issue: "Build failed"
Check your package.json has all dependencies in "dependencies" (not devDependencies).

### Issue: "WebSocket connection failed"
Railway supports WebSockets by default. Ensure your client connects to the Railway domain using wss:// protocol.

### Issue: "Environment variables not working"
Redeploy after setting variables:
```bash
railway up
```

## Production Checklist

- [ ] Switch `SOLANA_NETWORK` to `mainnet-beta`
- [ ] Use mainnet RPC URL: `https://api.mainnet-beta.solana.com`
- [ ] Secure treasury wallet with hardware wallet
- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Test reward distribution thoroughly
- [ ] Enable Railway's automatic SSL
- [ ] Set up error tracking (Sentry)
- [ ] Configure custom domain (optional)

## Support Links

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- Colyseus Discord: https://discord.gg/colyseus
- Solana Discord: https://discord.gg/solana

## Next Steps

1. Connect your game client to: `wss://your-app.up.railway.app`
2. Test wallet connection and rewards
3. Monitor logs for any issues
4. Scale up if needed (Railway auto-scales)

Your PokeMMO server is now live on Railway! 🎮🚀