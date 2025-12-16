import express from 'express';
import auth, { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Submission from '../models/Submission';
import Problem from '../models/Problem';
import Contest from '../models/Contest';

const router = express.Router();

// @route   GET api/dashboard
// @desc    Get dashboard data
// @access  Private
router.get('/', auth, async (req: AuthRequest, res: any) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // 1. Stats
        const totalSolved = user.solvedProblems ? user.solvedProblems.length : 0;
        const globalRank = 420; // TODO: Real calculation based on points/rating

        // 2. Activity (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const submissions = await Submission.find({
            user: userId,
            createdAt: { $gte: sevenDaysAgo }
        });

        // Initialize last 7 days map
        const activityMap = new Map();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // Create entries for last 7 days including today
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = days[d.getDay()];
            // Key by date string to avoid overwriting same-named days if logic changes, but dayName is fine for 7 days
            // Actually, if we just want "Mon", "Tue" etc, we rely on them being unique in 7 days.
            activityMap.set(dayName, { name: dayName, solved: 0, attempts: 0, date: d });
        }

        // Fill data
        submissions.forEach(sub => {
            if (sub.createdAt) {
                const d = new Date(sub.createdAt as any);
                const dayName = days[d.getDay()];
                // We need to ensure we map to the correct instance of dayName (in case of >7 days or edge cases)
                // Since we filtered by $gte sevenDaysAgo, it should match our map.
                if (activityMap.has(dayName)) {
                    const day = activityMap.get(dayName);
                    day.attempts++;
                    if (sub.verdict === 'Accepted') day.solved++;
                }
            }
        });

        // Convert to array and ensure order (from 6 days ago in map it's insertion order usually, but let's sort by date)
        const activity = Array.from(activityMap.values())
            .sort((a, b) => a.date - b.date)
            .map(({ name, solved, attempts }) => ({ name, solved, attempts }));


        // 3. Rating Growth (Mock if empty)
        let ratingGrowth = [
            { name: 'Jan', rating: 1200 },
            { name: 'Feb', rating: 1250 },
            { name: 'Mar', rating: user.cpStats?.mafiaRating || 1200 }
        ];

        // 4. Weak Spots
        // Find failed submissions, group by tag
        const failedSubs = await Submission.find({ user: userId, verdict: { $ne: 'Accepted' } })
            .populate('problem')
            .sort({ createdAt: -1 })
            .limit(50);

        const weakSpotMap = new Map();
        failedSubs.forEach((sub: any) => {
            if (sub.problem && sub.problem.tags) {
                sub.problem.tags.forEach((tag: string) => {
                    weakSpotMap.set(tag, (weakSpotMap.get(tag) || 0) + 1);
                });
            }
        });

        const weakSpots = Array.from(weakSpotMap.entries())
            .map(([topic, count]) => ({
                topic,
                percentage: Math.min((count as number) * 10, 90), // heuristics
                color: 'bg-red-500' // default
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 3);

        // Fallback if no weak spots
        if (weakSpots.length === 0) {
            weakSpots.push({ topic: "Trees", percentage: 0, color: "bg-green-500" });
        }

        // 5. Recommended Problems
        const solvedIds = user.solvedProblems || [];
        const recommended = await Problem.aggregate([
            { $match: { _id: { $nin: solvedIds } } },
            { $sample: { size: 3 } },
            { $project: { title: 1, difficulty: 1, slug: 1 } }
        ]);

        // 6. Upcoming Contests
        const upcomingContests = await Contest.find({ startTime: { $gt: new Date() } })
            .sort({ startTime: 1 })
            .limit(3)
            .select('title startTime');

        res.json({
            stats: {
                mafiaLevel: user.mafiaLevel,
                xp: user.xp,
                role: user.role,
                totalSolved,
                streak: user.streak,
                mafiaRating: user.cpStats?.mafiaRating || 0,
                globalRank
            },
            activity,
            ratingGrowth,
            weakSpots,
            recommended,
            upcomingContests
        });

    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

export default router;
