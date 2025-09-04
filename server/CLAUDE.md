# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with auto-reload using nodemon
- `npm start` - Start production server

### Testing
- `npm run loadtest` - Run Colyseus load testing against my_room with 2 clients

## Architecture Overview

This is a Colyseus-based multiplayer game server for a Pokemon MMO game. The server uses:

- **Colyseus framework** for real-time multiplayer game rooms
- **Express** for HTTP server and middleware
- **WebSocket** communication for real-time player updates

### Core Components

1. **server.js**: Main entry point that:
   - Sets up Express server with CORS
   - Creates Colyseus game server instance
   - Registers the PokeWorld room handler as "poke_world"
   - Monitors room lifecycle (create, dispose, join, leave)
   - Exposes Colyseus monitoring at `/colyseus` endpoint

2. **rooms/PokeWorld.js**: Game room handler that manages:
   - Player state storage in memory (sessionId, map, x, y coordinates)
   - Real-time message handling:
     - `PLAYER_MOVED`: Updates player position and broadcasts to other players
     - `PLAYER_MOVEMENT_ENDED`: Notifies other players when movement stops
     - `PLAYER_CHANGED_MAP`: Handles map transitions and syncs player states
   - Player lifecycle:
     - `onJoin`: Initializes new player at spawn point (town map, coordinates 352,1216)
     - `onLeave`: Removes player and notifies others
   - Broadcasting patterns: Uses `{except: player}` to exclude sender from broadcasts

### Message Protocol

The server expects and sends these message types:
- Client → Server: PLAYER_MOVED, PLAYER_MOVEMENT_ENDED, PLAYER_CHANGED_MAP
- Server → Client: CURRENT_PLAYERS, PLAYER_JOINED, PLAYER_LEFT, PLAYER_MOVED, PLAYER_MOVEMENT_ENDED, PLAYER_CHANGED_MAP

### State Management

Player state is maintained in a simple in-memory object (`players`) indexed by sessionId. No database persistence - state is lost on server restart.

### Port Configuration

Server runs on port 3000 by default (configurable via PORT environment variable).

## Solana Integration

The server includes Solana blockchain integration for Web3 functionality:

### Components

1. **services/solanaService.js**: Core blockchain service that handles:
   - Wallet signature verification
   - SOL and SPL token balance checking
   - Reward distribution (SOL or custom tokens)
   - Transaction history retrieval
   - Connection to Solana network (configurable: mainnet/devnet/testnet)

2. **routes/auth.js**: Authentication endpoints:
   - `/api/auth/wallet-connect`: Verify wallet ownership via signature
   - `/api/auth/verify-token`: Validate JWT tokens
   - `/api/auth/wallet-balance/:address`: Get wallet balances
   - `/api/auth/transactions/:address`: Fetch recent transactions

3. **Enhanced PokeWorld Room**: Blockchain-enabled game mechanics:
   - `WALLET_CONNECT`: Link Solana wallet to player session
   - `CHECK_BALANCE`: Query current wallet balances
   - `BATTLE_WON`: Trigger battle victory rewards
   - Automatic rewards for: joining game, changing maps, winning battles

### Environment Configuration

Required `.env` variables:
```
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
TREASURY_PRIVATE_KEY=[base58 encoded private key]
GAME_TOKEN_MINT=[optional SPL token address]
REWARD_PLAYER_JOIN=100000
REWARD_MAP_CHANGE=50000
REWARD_BATTLE_WIN=500000
```

### Reward System

Players earn SOL/tokens for in-game activities:
- Join reward: 0.0001 SOL (100000 lamports)
- Map change: 0.00005 SOL (50000 lamports)
- Battle victory: 0.0005 SOL (500000 lamports)

Treasury wallet must be funded to distribute rewards.