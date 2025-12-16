import express from 'express';
import User from '../models/User';

const router = express.Router();

// Get Global Leaderboard
router.get('/global', async (req, res) => {
    try {
        // Sort by mafiaRating (desc), then xp (desc)
        const users = await User.find()
            .sort({ 'cpStats.mafiaRating': -1, xp: -1 })
            .limit(50)
            .select('username cpStats.mafiaRating xp solvedProblems streak avatar');

        // Transform data for frontend
        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            mafiaRating: user.cpStats?.mafiaRating || 1200, // Default rating
            totalSolved: user.solvedProblems.length,
            streak: user.streak || 0,
            avatar: user.avatar
        }));

        res.json(leaderboard);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

export default router;
