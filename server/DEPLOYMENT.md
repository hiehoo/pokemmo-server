# Deployment Guide for PokeMMO Server

This guide covers multiple deployment options for your PokeMMO game server with Solana integration.

## Prerequisites

1. **Solana Wallet Setup**:
   - Create a treasury wallet for rewards
   - Fund it with SOL (use devnet for testing, mainnet for production)
   - Get the private key in base58 format

2. **Environment Variables**:
   - Copy `.env.example` to `.env` for local development
   - Use `.env.production` as a template for production settings
   - Never commit `.env` files to git

## Deployment Options

### Option 1: Railway (Recommended for Gaming)
Railway provides excellent WebSocket support and easy deployment.

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize and deploy
railway init
railway up

# Set environment variables
railway variables set SOLANA_NETWORK=mainnet-beta
railway variables set TREASURY_PRIVATE_KEY=your-key
railway variables set JWT_SECRET=your-secret
```

Visit: https://railway.app

### Option 2: Render
Free tier available with automatic deploys from GitHub.

1. Push code to GitHub
2. Connect repository at https://render.com
3. Use the included `render.yaml` configuration
4. Set environment variables in Render dashboard

### Option 3: Fly.io
Great for global edge deployment with WebSocket support.

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login and launch
fly auth login
fly launch

# Deploy
fly deploy

# Set secrets
fly secrets set TREASURY_PRIVATE_KEY=your-key
fly secrets set JWT_SECRET=your-secret
```

### Option 4: DigitalOcean App Platform

1. Create account at https://digitalocean.com
2. Click "Create" → "Apps"
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Run Command: `node server.js`
5. Set environment variables in settings

### Option 5: Heroku
Good for rapid deployment with built-in scaling.

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-pokemmo-server

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git push heroku master

# Set config vars
heroku config:set SOLANA_NETWORK=mainnet-beta
heroku config:set TREASURY_PRIVATE_KEY=your-key
heroku config:set JWT_SECRET=your-secret

# Scale dynos
heroku ps:scale web=1
```

### Option 6: AWS EC2 / VPS (Full Control)

For Ubuntu/Debian servers:

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2
sudo npm install -g pm2

# 4. Clone repository
git clone your-repo-url
cd server

# 5. Install dependencies
npm install --production

# 6. Create .env file
nano .env
# Add your environment variables

# 7. Start with PM2
pm2 start ecosystem.config.js

# 8. Setup PM2 to restart on reboot
pm2 startup
pm2 save

# 9. Setup Nginx (optional, for reverse proxy)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/pokemmo

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/pokemmo /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

### Option 7: Docker Deployment

Using the included Docker configuration:

```bash
# Build image
docker build -t pokemmo-server .

# Run with docker-compose
docker-compose up -d

# Or run directly
docker run -d \
  -p 3000:3000 \
  -e SOLANA_NETWORK=mainnet-beta \
  -e TREASURY_PRIVATE_KEY=your-key \
  -e JWT_SECRET=your-secret \
  --name pokemmo \
  pokemmo-server
```

## Production Checklist

### Security
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Secure treasury private key storage
- [ ] Enable HTTPS/TLS
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Use environment variables (never hardcode secrets)

### Performance
- [ ] Enable PM2 cluster mode for multiple cores
- [ ] Set up monitoring (New Relic, DataDog, etc.)
- [ ] Configure auto-scaling
- [ ] Optimize WebSocket connections
- [ ] Set up CDN for static assets

### Solana Setup
- [ ] Switch to mainnet-beta for production
- [ ] Fund treasury wallet appropriately
- [ ] Test reward distribution thoroughly
- [ ] Monitor transaction costs
- [ ] Set appropriate reward amounts

### Monitoring
- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Configure logging aggregation
- [ ] Set up uptime monitoring
- [ ] Create health check endpoint

## WebSocket Considerations

For platforms that don't support WebSockets natively:
- Use sticky sessions for load balancing
- Configure long polling as fallback
- Ensure firewall allows WebSocket connections
- Test with actual game clients

## Scaling Tips

1. **Horizontal Scaling**: Use PM2 cluster mode or container orchestration
2. **Database**: Consider Redis for session storage
3. **Load Balancing**: Use Nginx or HAProxy
4. **Caching**: Implement Redis for frequently accessed data
5. **CDN**: Use Cloudflare for global distribution

## Cost Estimation

- **Railway**: ~$5-20/month
- **Render**: Free tier available, ~$7/month for paid
- **Fly.io**: ~$5-15/month
- **DigitalOcean**: $5-40/month depending on droplet
- **Heroku**: ~$7-25/month
- **AWS EC2**: $5-50/month depending on instance

## Troubleshooting

### WebSocket Connection Issues
```bash
# Test WebSocket connection
wscat -c ws://your-server:3000
```

### Port Already in Use
```bash
# Find and kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### SSL/TLS Setup with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Support

For issues specific to:
- Colyseus: https://docs.colyseus.io
- Solana: https://docs.solana.com
- Deployment platforms: Check their respective documentation

Remember to test your deployment thoroughly before directing real users to it!