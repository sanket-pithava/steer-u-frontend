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

export default router;
