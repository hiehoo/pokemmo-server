const colyseus = require('colyseus');
const solanaService = require('../services/solanaService');

const players = {};
exports.PokeWorld = class extends colyseus.Room {
    onCreate(options) {
        console.log('ON CREATE');

        this.rewardAmounts = {
            join: parseInt(process.env.REWARD_PLAYER_JOIN) || 100000,
            mapChange: parseInt(process.env.REWARD_MAP_CHANGE) || 50000,
            battleWin: parseInt(process.env.REWARD_BATTLE_WIN) || 500000
        };

        this.onMessage("WALLET_CONNECT", async (player, data) => {
            const { walletAddress, token } = data;
            
            if (!walletAddress) {
                player.send("WALLET_ERROR", { error: "Wallet address required" });
                return;
            }
            
            players[player.sessionId].walletAddress = walletAddress;
            players[player.sessionId].authenticated = true;
            
            const balance = await solanaService.getWalletBalance(walletAddress);
            players[player.sessionId].solBalance = balance;
            
            if (process.env.GAME_TOKEN_MINT) {
                const tokenBalance = await solanaService.getTokenBalance(walletAddress);
                players[player.sessionId].tokenBalance = tokenBalance;
            }
            
            player.send("WALLET_CONNECTED", {
                walletAddress,
                solBalance: balance,
                tokenBalance: players[player.sessionId].tokenBalance || 0
            });
            
            this.broadcast("PLAYER_WALLET_CONNECTED", {
                sessionId: player.sessionId,
                walletAddress
            }, { except: player });
            
            if (solanaService.treasuryKeypair) {
                const signature = await solanaService.sendReward(
                    walletAddress,
                    this.rewardAmounts.join,
                    'SOL'
                );
                
                if (signature) {
                    player.send("REWARD_RECEIVED", {
                        type: 'join',
                        amount: this.rewardAmounts.join,
                        signature
                    });
                }
            }
        });

        this.onMessage("PLAYER_MOVED", (player, data) => {
            console.log("PLAYER_MOVED", data);

            players[player.sessionId].x = data.x;
            players[player.sessionId].y = data.y;

            this.broadcast("PLAYER_MOVED", {
                ...players[player.sessionId],
                position: data.position
            }, { except: player })
        });

        this.onMessage("PLAYER_MOVEMENT_ENDED", (player, data) => {
            this.broadcast("PLAYER_MOVEMENT_ENDED", {
                sessionId: player.sessionId,
                map: players[player.sessionId].map,
                position: data.position
            }, { except: player })
        });

        this.onMessage("PLAYER_CHANGED_MAP", async (player, data) => {
            players[player.sessionId].map = data.map;
            
            const playerData = players[player.sessionId];
            
            if (playerData.walletAddress && solanaService.treasuryKeypair) {
                const signature = await solanaService.sendReward(
                    playerData.walletAddress,
                    this.rewardAmounts.mapChange,
                    'SOL'
                );
                
                if (signature) {
                    player.send("REWARD_RECEIVED", {
                        type: 'map_change',
                        amount: this.rewardAmounts.mapChange,
                        signature,
                        newMap: data.map
                    });
                }
            }
    
            player.send("CURRENT_PLAYERS", { players: players })

            this.broadcast("PLAYER_CHANGED_MAP", {
                sessionId: player.sessionId,
                map: players[player.sessionId].map,
                x: 300,
                y: 75,
                players: players
            })
        });

        this.onMessage("BATTLE_WON", async (player, data) => {
            const playerData = players[player.sessionId];
            
            if (!playerData.walletAddress) {
                player.send("BATTLE_ERROR", { 
                    error: "Connect wallet to receive rewards" 
                });
                return;
            }
            
            if (solanaService.treasuryKeypair) {
                const signature = await solanaService.sendReward(
                    playerData.walletAddress,
                    this.rewardAmounts.battleWin,
                    'SOL'
                );
                
                if (signature) {
                    player.send("REWARD_RECEIVED", {
                        type: 'battle_win',
                        amount: this.rewardAmounts.battleWin,
                        signature,
                        opponent: data.opponent
                    });
                    
                    this.broadcast("PLAYER_WON_BATTLE", {
                        sessionId: player.sessionId,
                        opponent: data.opponent,
                        rewarded: true
                    });
                }
            }
            
            if (!playerData.battleWins) {
                playerData.battleWins = 0;
            }
            playerData.battleWins++;
        });

        this.onMessage("CHECK_BALANCE", async (player, data) => {
            const playerData = players[player.sessionId];
            
            if (!playerData.walletAddress) {
                player.send("BALANCE_ERROR", { 
                    error: "No wallet connected" 
                });
                return;
            }
            
            const solBalance = await solanaService.getWalletBalance(playerData.walletAddress);
            let tokenBalance = 0;
            
            if (process.env.GAME_TOKEN_MINT) {
                tokenBalance = await solanaService.getTokenBalance(playerData.walletAddress);
            }
            
            player.send("BALANCE_UPDATE", {
                solBalance,
                tokenBalance,
                walletAddress: playerData.walletAddress
            });
        });
    }

    onJoin(player, options) {
        console.log('ON JOIN');

        players[player.sessionId] = {
            sessionId: player.sessionId,
            map: 'town',
            x: 352,
            y: 1216,
            walletAddress: null,
            authenticated: false,
            solBalance: 0,
            tokenBalance: 0
        };

        setTimeout(() => player.send("CURRENT_PLAYERS", { players: players }), 500);
        this.broadcast("PLAYER_JOINED", { ...players[player.sessionId] }, { except: player });
    }

    onLeave(player, consented) {
        console.log('ON LEAVE')

        this.broadcast("PLAYER_LEFT", { 
            sessionId: player.sessionId, 
            map: players[player.sessionId].map,
            walletAddress: players[player.sessionId].walletAddress
        });
        delete players[player.sessionId];
    }

    onDispose() {
        console.log('ON DISPOSE')
    }
};