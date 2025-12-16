import express from 'express';
import User from '../models/User';
import Submission from '../models/Submission';
import Problem from '../models/Problem';

const router = express.Router();

// @route   GET api/profile/:username
// @desc    Get public profile data
// @access  Public
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // 1. Get User Basic Info & Solved Problems
        const user = await User.findOne({ username })
            .select('-password -email -googleId -githubId') // Hide private info
            .populate('solvedProblems', 'difficulty'); // Get difficulty of solved problems

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // 2. Calculate Stats (Easy/Medium/Hard)
        let easy = 0, medium = 0, hard = 0;
        if (user.solvedProblems && Array.isArray(user.solvedProblems)) {
            user.solvedProblems.forEach((problem: any) => {
                if (problem.difficulty === 'Easy') easy++;
                else if (problem.difficulty === 'Medium') medium++;
                else if (problem.difficulty === 'Hard') hard++;
            });
        }
        const totalSolved = easy + medium + hard;

        // 3. Get Recent Activity (Heatmap Data)
        // We want counts of submissions per day for the last year
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const submissions = await Submission.find({
            user: user._id,
            createdAt: { $gte: oneYearAgo }
        }).select('createdAt');

        const activityMap = new Map<string, number>();

        submissions.forEach(sub => {
            const date = (sub as any).createdAt.toISOString().split('T')[0];
            activityMap.set(date, (activityMap.get(date) || 0) + 1);
        });

        // Convert map to array for client
        const recentActivity = Array.from(activityMap.entries()).map(([date, count]) => ({
            date,
            count
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 4. Construct Response
        const profileData = {
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
            skills: user.skills,
            college: user.college,
            socials: user.socials,
            mafiaLevel: user.mafiaLevel, // Just string in model, but client interface expects string? Interface says number in client code, let's check
            xp: user.xp,
            streak: user.streak,
            mafiaRating: user.cpStats?.mafiaRating || 0,
            solvedProblems: user.solvedProblems.map((p: any) => p._id), // Just IDs for list if needed
            stats: {
                totalSolved,
                easy,
                medium,
                hard,
                contests: user.contestHistory?.length || 0,
                ranking: 0 // Placeholder, requires global ranking logic
            },
            recentActivity
        };

        res.json(profileData);

    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
