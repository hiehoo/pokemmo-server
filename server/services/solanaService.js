const { 
    Connection, 
    PublicKey, 
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Keypair
} = require('@solana/web3.js');
const { 
    getOrCreateAssociatedTokenAccount,
    transfer,
    TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const bs58 = require('bs58');

class SolanaService {
    constructor() {
        this.connection = null;
        this.treasuryKeypair = null;
        this.gameTokenMint = null;
        this.initialized = false;
    }

    initialize() {
        try {
            const network = process.env.SOLANA_NETWORK || 'devnet';
            const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
            
            this.connection = new Connection(rpcUrl, 'confirmed');
            
            if (process.env.TREASURY_PRIVATE_KEY) {
                const secretKey = bs58.decode(process.env.TREASURY_PRIVATE_KEY);
                this.treasuryKeypair = Keypair.fromSecretKey(secretKey);
                console.log('Treasury wallet initialized:', this.treasuryKeypair.publicKey.toString());
            } else {
                console.warn('No treasury private key found. Reward system will be disabled.');
            }
            
            if (process.env.GAME_TOKEN_MINT) {
                this.gameTokenMint = new PublicKey(process.env.GAME_TOKEN_MINT);
                console.log('Game token mint:', this.gameTokenMint.toString());
            }
            
            this.initialized = true;
            console.log(`Solana service initialized on ${network}`);
        } catch (error) {
            console.error('Failed to initialize Solana service:', error);
        }
    }

    async verifyWalletSignature(walletAddress, message, signature) {
        try {
            const publicKey = new PublicKey(walletAddress);
            const signatureBuffer = bs58.decode(signature);
            const messageBuffer = Buffer.from(message);
            
            const nacl = require('tweetnacl');
            const isValid = nacl.sign.detached.verify(
                messageBuffer,
                signatureBuffer,
                publicKey.toBuffer()
            );
            
            return isValid;
        } catch (error) {
            console.error('Signature verification failed:', error);
            return false;
        }
    }

    async getWalletBalance(walletAddress) {
        try {
            const publicKey = new PublicKey(walletAddress);
            const balance = await this.connection.getBalance(publicKey);
            return balance / LAMPORTS_PER_SOL;
        } catch (error) {
            console.error('Failed to get wallet balance:', error);
            return 0;
        }
    }

    async getTokenBalance(walletAddress, tokenMint) {
        try {
            const walletPubkey = new PublicKey(walletAddress);
            const mintPubkey = new PublicKey(tokenMint || this.gameTokenMint);
            
            const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
                walletPubkey,
                { mint: mintPubkey }
            );
            
            if (tokenAccounts.value.length === 0) {
                return 0;
            }
            
            const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            return balance;
        } catch (error) {
            console.error('Failed to get token balance:', error);
            return 0;
        }
    }

    async sendReward(recipientWallet, amount, rewardType = 'SOL') {
        if (!this.treasuryKeypair) {
            console.warn('Treasury wallet not configured. Cannot send rewards.');
            return null;
        }

        try {
            const recipientPubkey = new PublicKey(recipientWallet);
            
            if (rewardType === 'SOL' || !this.gameTokenMint) {
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: this.treasuryKeypair.publicKey,
                        toPubkey: recipientPubkey,
                        lamports: amount,
                    })
                );
                
                const signature = await this.connection.sendTransaction(
                    transaction,
                    [this.treasuryKeypair]
                );
                
                await this.connection.confirmTransaction(signature);
                console.log(`Sent ${amount} lamports to ${recipientWallet}. Signature: ${signature}`);
                return signature;
            } else {
                const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                    this.connection,
                    this.treasuryKeypair,
                    this.gameTokenMint,
                    this.treasuryKeypair.publicKey
                );
                
                const toTokenAccount = await getOrCreateAssociatedTokenAccount(
                    this.connection,
                    this.treasuryKeypair,
                    this.gameTokenMint,
                    recipientPubkey
                );
                
                const signature = await transfer(
                    this.connection,
                    this.treasuryKeypair,
                    fromTokenAccount.address,
                    toTokenAccount.address,
                    this.treasuryKeypair.publicKey,
                    amount
                );
                
                console.log(`Sent ${amount} tokens to ${recipientWallet}. Signature: ${signature}`);
                return signature;
            }
        } catch (error) {
            console.error('Failed to send reward:', error);
            return null;
        }
    }

    async createPlayerNFT(walletAddress, playerData) {
        console.log('NFT creation would require additional setup with Metaplex');
        return null;
    }

    async getRecentTransactions(walletAddress, limit = 10) {
        try {
            const publicKey = new PublicKey(walletAddress);
            const signatures = await this.connection.getSignaturesForAddress(
                publicKey,
                { limit }
            );
            
            const transactions = [];
            for (const sig of signatures) {
                const tx = await this.connection.getParsedTransaction(sig.signature);
                transactions.push({
                    signature: sig.signature,
                    slot: sig.slot,
                    timestamp: tx?.blockTime,
                    success: !sig.err
                });
            }
            
            return transactions;
        } catch (error) {
            console.error('Failed to get recent transactions:', error);
            return [];
        }
    }
}

module.exports = new SolanaService();