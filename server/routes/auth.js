const express = require('express');
const router = express.Router();
const solanaService = require('../services/solanaService');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

router.post('/wallet-connect', async (req, res) => {
    try {
        const { walletAddress, signature, message } = req.body;
        
        if (!walletAddress || !signature || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields: walletAddress, signature, message' 
            });
        }
        
        const isValid = await solanaService.verifyWalletSignature(
            walletAddress,
            message,
            signature
        );
        
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid signature' });
        }
        
        const balance = await solanaService.getWalletBalance(walletAddress);
        
        const token = jwt.sign(
            { 
                walletAddress,
                timestamp: Date.now()
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token,
            walletAddress,
            balance
        });
    } catch (error) {
        console.error('Wallet connection error:', error);
        res.status(500).json({ error: 'Failed to connect wallet' });
    }
});

router.post('/verify-token', (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ 
            valid: true, 
            walletAddress: decoded.walletAddress 
        });
    } catch (error) {
        res.status(401).json({ 
            valid: false, 
            error: 'Invalid or expired token' 
        });
    }
});

router.get('/wallet-balance/:address', async (req, res) => {
    try {
        const { address } = req.params;
        
        const solBalance = await solanaService.getWalletBalance(address);
        
        let tokenBalance = 0;
        if (process.env.GAME_TOKEN_MINT) {
            tokenBalance = await solanaService.getTokenBalance(address);
        }
        
        res.json({
            walletAddress: address,
            solBalance,
            tokenBalance,
            tokenMint: process.env.GAME_TOKEN_MINT || null
        });
    } catch (error) {
        console.error('Balance check error:', error);
        res.status(500).json({ error: 'Failed to get balance' });
    }
});

router.get('/transactions/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        
        const transactions = await solanaService.getRecentTransactions(address, limit);
        
        res.json({
            walletAddress: address,
            transactions
        });
    } catch (error) {
        console.error('Transaction fetch error:', error);
        res.status(500).json({ error: 'Failed to get transactions' });
    }
});

module.exports = router;