import express from 'express';
import verifyToken from '../middleware/auth.js';
import prisma from '../prisma.js';

const router = express.Router();

// Example protected route
router.get('/profile/me', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mock prediction route
router.post('/engine/get-prediction', verifyToken, async (req, res) => {
    try {
        const { questionText, userDetails } = req.body;
        // Mock prediction logic
        const prediction = `Based on your birth details (DOB: ${userDetails.dob}, Time: ${userDetails.timeOfBirth}, Place: ${userDetails.placeOfBirth}), the answer to "${questionText}" is: This is a mock prediction. Please implement the actual engine.`;
        res.json({ success: true, prediction });
    } catch (error) {
        res.status(500).json({ message: 'Engine configuration error.' });
    }
});

// Update profile
router.put('/profile/update', verifyToken, async (req, res) => {
    try {
        const updates = req.body;
        const user = await prisma.user.update({
            where: { id: req.userId },
            data: updates
        });
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use referral credit
router.post('/profile/use-referral-credit', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user || user.referralCredits <= 0) {
            return res.status(400).json({ message: 'No referral credits available' });
        }
        await prisma.user.update({
            where: { id: req.userId },
            data: { referralCredits: user.referralCredits - 1 }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mock payment create order
router.post('/payment/create-order', verifyToken, async (req, res) => {
    try {
        const { amount, receipt } = req.body;
        // Mock order
        const order = { id: 'mock_order_' + Date.now(), amount, currency: 'INR' };
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mock payment verify
router.post('/payment/verify', verifyToken, async (req, res) => {
    try {
        // Mock verification
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save prediction
router.post('/predictions/save', verifyToken, async (req, res) => {
    try {
        const { question, answer, details } = req.body;
        // Assuming there's a Prediction model in prisma
        // For now, mock
        console.log('Saving prediction:', { question, answer, details, userId: req.userId });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
