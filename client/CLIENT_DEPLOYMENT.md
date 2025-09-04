# 🎮 PokeMMO Client UI Deployment Guide

## Overview
The client is a Phaser 3 game with Solana wallet integration, featuring:
- ⚡ Phantom wallet connection
- 💰 Real-time SOL rewards display
- 🎮 Multiplayer game with WebSocket connection
- 📊 Live game statistics
- 🎨 Modern, responsive UI

## Local Development

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start Development Server
```bash
npm start
```
This will open the game at `http://localhost:8080`

### 3. Build for Production
```bash
npm run build
```
This creates a `dist` folder with optimized files.

## Deployment Options

### Option 1: Netlify (Recommended for Static Sites)

#### Method A: Drag & Drop
1. Build the project: `npm run build`
2. Go to https://app.netlify.com
3. Drag the `dist` folder to the deployment area
4. Your game is live!

#### Method B: Git Integration
1. Push code to GitHub
2. In Netlify:
   - Click "New site from Git"
   - Connect GitHub repository
   - Build settings:
     - Base directory: `client`
     - Build command: `npm run build`
     - Publish directory: `client/dist`
3. Click "Deploy site"

Your game will be at: `https://your-app.netlify.app`

### Option 2: Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd client
vercel
```

3. Follow prompts:
   - Set up and deploy: Y
   - Which scope: Your account
   - Link to existing project: N
   - Project name: pokemmo-client
   - Directory: ./
   - Build Command: npm run build
   - Output Directory: dist

Your game will be at: `https://pokemmo-client.vercel.app`

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Deploy:
```bash
npm run deploy
```

Your game will be at: `https://YOUR_USERNAME.github.io/pokemmo-client`

### Option 4: Surge.sh (Quick & Free)

1. Install Surge:
```bash
npm install -g surge
```

2. Build and deploy:
```bash
npm run build
cd dist
surge
```

3. Choose domain or use generated one

Your game will be at: `https://your-chosen-name.surge.sh`

### Option 5: Render Static Site

1. Create `render.yaml` in client folder:
```yaml
services:
  - type: web
    name: pokemmo-client
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    headers:
      - path: /*
        name: X-Frame-Options
        value: SAMEORIGIN
```

2. Push to GitHub
3. Connect on Render.com
4. Deploy

## Environment Configuration

### Update Server URL

In `index.html`, update the server URLs:

```javascript
const SERVER_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://pokemmo-server.onrender.com'; // Your server URL

const WS_URL = window.location.hostname === 'localhost'
    ? 'ws://localhost:3000'
    : 'wss://pokemmo-server.onrender.com'; // Your WebSocket URL
```

## Features of the UI

### 1. Wallet Integration
- Connect Phantom wallet
- Display SOL balance
- Show wallet address
- Auto-reconnect on refresh

### 2. Game Stats
- Players online counter
- Current map display
- Battles won tracker
- Total rewards earned

### 3. Server Status
- Real-time connection indicator
- Visual feedback (green/red dot)
- Connection status text

### 4. Reward Notifications
- Pop-up animations
- Reward amount display
- Reward type explanation
- Auto-hide after 5 seconds

### 5. Responsive Design
- Mobile-friendly layout
- Gradient backgrounds
- Glass morphism effects
- Smooth animations

## Testing the Deployment

### 1. Check Server Connection
Open browser console and verify:
```javascript
// Should show: Connected to server
```

### 2. Test Wallet Connection
1. Install Phantom wallet
2. Switch to Devnet
3. Click "Connect Wallet"
4. Approve connection

### 3. Verify Game Loading
- Phaser game should load in the container
- Controls should be responsive
- Other players should be visible

## Troubleshooting

### Issue: "Cannot connect to server"
- Check if server is running
- Verify SERVER_URL in index.html
- Check CORS settings on server

### Issue: "Phantom wallet not found"
- Install from https://phantom.app
- Refresh the page
- Check browser compatibility

### Issue: "Game not loading"
- Check browser console for errors
- Verify all assets are loaded
- Clear browser cache

### Issue: "WebSocket connection failed"
- Ensure server supports WebSocket
- Check if using wss:// for HTTPS
- Verify firewall settings

## Production Checklist

- [ ] Update SERVER_URL to production server
- [ ] Switch Solana to mainnet-beta (if going live)
- [ ] Optimize images and assets
- [ ] Enable caching headers
- [ ] Set up CDN for assets
- [ ] Add error tracking (Sentry)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Add Google Analytics (optional)
- [ ] Create custom domain

## Performance Optimization

### 1. Asset Optimization
```bash
# Compress images
npm install imagemin-cli -g
imagemin src/assets/* --out-dir=dist/assets
```

### 2. Code Splitting
Already handled by Webpack configuration

### 3. CDN Setup
Use Cloudflare or similar for global distribution

## Monitoring

### Add Analytics
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### Error Tracking
```javascript
// Add Sentry
Sentry.init({ 
    dsn: "YOUR_SENTRY_DSN" 
});
```

## Next Steps

1. Deploy client to chosen platform
2. Update server URL in index.html
3. Test wallet integration
4. Share your game URL!

Your PokeMMO game is ready for players! 🎮🚀