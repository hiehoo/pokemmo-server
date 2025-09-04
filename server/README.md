# 🎮 PokeMMO Server - Multiplayer Game with Solana Integration

A real-time multiplayer Pokemon MMO game server built with Colyseus and integrated with Solana blockchain for Web3 features including wallet authentication, token rewards, and NFT support.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Colyseus](https://img.shields.io/badge/Colyseus-0.15-blue)
![Solana](https://img.shields.io/badge/Solana-Web3-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎯 Core Game Features
- **Real-time Multiplayer**: Seamless player synchronization using Colyseus
- **Multiple Maps**: Dynamic map transitions with player state persistence
- **Player Movement**: Real-time position updates and movement synchronization
- **Battle System**: PvP battles with reward distribution
- **Auto-scaling**: Room-based architecture for horizontal scaling

### 🔗 Blockchain Integration
- **Wallet Authentication**: Connect Solana wallets for secure player identity
- **Token Rewards**: Automatic SOL/SPL token distribution for:
  - Joining the game (0.0001 SOL)
  - Changing maps (0.00005 SOL)
  - Winning battles (0.0005 SOL)
- **Balance Tracking**: Real-time wallet and token balance monitoring
- **Transaction History**: View recent blockchain transactions
- **NFT Support**: Framework for player NFT creation (Metaplex ready)

### 🛠️ Technical Features
- **WebSocket Support**: Full duplex communication for real-time gameplay
- **JWT Authentication**: Secure session management
- **Monitoring Dashboard**: Built-in Colyseus monitor at `/colyseus`
- **Environment Flexibility**: Supports devnet, testnet, and mainnet
- **Docker Support**: Containerized deployment ready
- **Auto-deploy**: CI/CD ready with GitHub integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Solana wallet (for rewards system)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/pokemmo-server.git
cd pokemmo-server
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Solana Configuration
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
TREASURY_PRIVATE_KEY=your-wallet-private-key
JWT_SECRET=your-secret-key

# Rewards (in lamports)
REWARD_PLAYER_JOIN=100000
REWARD_MAP_CHANGE=50000
REWARD_BATTLE_WIN=500000
```

4. **Run the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will be available at: `http://localhost:3000`

## 🌐 Deployment

### Quick Deploy Options

#### Deploy to Render (Free Tier)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Push to GitHub
2. Connect repository on Render
3. Auto-deploys with included `render.yaml`

#### Deploy to Railway
```bash
railway login
railway init
railway up
```

#### Deploy with Docker
```bash
docker-compose up -d
```

See detailed deployment guides:
- [Railway Deployment](./RAILWAY_DEPLOY.md)
- [Render Deployment](./RENDER_DEPLOY.md) 
- [Full Deployment Guide](./DEPLOYMENT.md)

## 📡 API Endpoints

### WebSocket Endpoints
- Game Server: `ws://localhost:3000` (wss:// in production)
- Room: `poke_world`

### REST API Endpoints

#### Authentication
- `POST /api/auth/wallet-connect` - Connect and verify Solana wallet
- `POST /api/auth/verify-token` - Validate JWT token
- `GET /api/auth/wallet-balance/:address` - Get wallet balances
- `GET /api/auth/transactions/:address` - Get recent transactions

#### Monitoring
- `GET /colyseus` - Colyseus monitoring dashboard

## 🎮 Game Messages

### Client → Server Messages
- `WALLET_CONNECT` - Connect Solana wallet
- `PLAYER_MOVED` - Update player position
- `PLAYER_MOVEMENT_ENDED` - Stop player movement
- `PLAYER_CHANGED_MAP` - Change current map
- `BATTLE_WON` - Report battle victory
- `CHECK_BALANCE` - Request balance update

### Server → Client Messages
- `WALLET_CONNECTED` - Wallet connection confirmed
- `CURRENT_PLAYERS` - List of all players
- `PLAYER_JOINED` - New player joined
- `PLAYER_LEFT` - Player disconnected
- `REWARD_RECEIVED` - Token reward sent
- `BALANCE_UPDATE` - Wallet balance update

## 💰 Treasury Wallet Setup

### For Development (Devnet)

1. **Generate new wallet**
```bash
npx solana-keygen new --outfile treasury.json
```

2. **Get free devnet SOL**
```bash
curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "requestAirdrop",
  "params": ["YOUR_PUBLIC_KEY", 2000000000]
}'
```

### For Production (Mainnet)
- Use hardware wallet (Ledger/Trezor)
- Secure key management service
- Fund with appropriate SOL amount

## 🏗️ Project Structure

```
server/
├── rooms/
│   └── PokeWorld.js       # Main game room logic
├── services/
│   └── solanaService.js   # Blockchain integration
├── routes/
│   └── auth.js            # Authentication endpoints
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example          # Environment template
├── render.yaml           # Render deployment config
├── railway.json          # Railway deployment config
├── Dockerfile            # Docker configuration
└── ecosystem.config.js   # PM2 configuration
```

## 🧪 Testing

```bash
# Run load testing
npm run loadtest

# Test WebSocket connection
wscat -c ws://localhost:3000

# Test Solana integration
curl http://localhost:3000/api/auth/wallet-balance/YOUR_WALLET
```

## 📊 Monitoring

- **Colyseus Monitor**: http://localhost:3000/colyseus
- **Logs**: Check console output or deployment platform logs
- **Metrics**: Available in deployment platform dashboards

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `SOLANA_NETWORK` | Solana network | devnet |
| `SOLANA_RPC_URL` | RPC endpoint | https://api.devnet.solana.com |
| `TREASURY_PRIVATE_KEY` | Treasury wallet key | - |
| `JWT_SECRET` | JWT signing secret | - |
| `GAME_TOKEN_MINT` | SPL token address | - |
| `REWARD_PLAYER_JOIN` | Join reward amount | 100000 |
| `REWARD_MAP_CHANGE` | Map change reward | 50000 |
| `REWARD_BATTLE_WIN` | Battle win reward | 500000 |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/awesome`)
3. Commit changes (`git commit -m 'Add awesome feature'`)
4. Push to branch (`git push origin feature/awesome`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Discord**: [Join our community](https://discord.gg/colyseus)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/pokemmo-server/issues)
- **Docs**: [Colyseus Docs](https://docs.colyseus.io)

## 🙏 Acknowledgments

- [Colyseus](https://colyseus.io) - Multiplayer game framework
- [Solana](https://solana.com) - Blockchain platform
- [Express](https://expressjs.com) - Web framework

## 🚦 Status

- ✅ Core game server
- ✅ Solana wallet integration
- ✅ Token rewards system
- ✅ Deployment configurations
- 🚧 NFT integration (coming soon)
- 🚧 Enhanced battle system (in progress)

---

**Built with ❤️ for the Web3 gaming community**