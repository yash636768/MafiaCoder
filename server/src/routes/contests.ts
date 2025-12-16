import express from 'express';
import Contest from '../models/Contest';
import Problem from '../models/Problem';
import Submission from '../models/Submission';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { executeCode } from '../utils/judge';

const router = express.Router();

// Middleware to get user (should be shared)
const auth = (req: any, res: any, next: any) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Get All Contests
router.get('/', async (req, res) => {
    try {
        const contests = await Contest.find().sort({ startTime: -1 });
        res.json(contests);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

// Create Contest (Admin)
router.post('/', async (req, res) => {
    try {
        const newContest = new Contest(req.body);
        const contest = await newContest.save();
        res.json(contest);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

// Submit Solution
router.post('/submit', auth, async (req: any, res: any) => {
    try {
        const { problemId, contestId, code, language } = req.body;
        const userId = req.user.id;

        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        // Create Submission
        const submission = new Submission({
            user: userId,
            problem: problemId,
            contest: contestId,
            code,
            language,
            verdict: 'Pending'
        });
        await submission.save();

        // Run Judge
        let passed = 0;
        let total = problem.testCases.length;
        let verdict = 'Accepted';

        for (const testCase of problem.testCases) {
            try {
                const result = await executeCode(language, code, testCase.input || '');

                if (result.run.code !== 0) {
                    verdict = 'Runtime Error'; // Or Compilation Error
                    if (result.compile && result.compile.code !== 0) verdict = 'Compilation Error';
                    break;
                }

                // Simple trim comparison
                if (result.run.stdout.trim() !== (testCase.output || '').trim()) {
                    verdict = 'Wrong Answer';
                    break;
                }
                passed++;
            } catch (err) {
                verdict = 'Runtime Error';
                break;
            }
        }

        submission.verdict = verdict as any;
        submission.testCasesPassed = passed;
        submission.totalTestCases = total;
        await submission.save();

        // Update User Stats (Simplified)
        if (verdict === 'Accepted') {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { solvedProblems: problemId },
                $inc: { xp: 10, streak: 1 }
            });
        }

        res.json(submission);

    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

// Register for Contest
router.post('/:id/register', auth, async (req: any, res: any) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) return res.status(404).json({ msg: 'Contest not found' });

        // Check if already registered
        if (contest.participants.some((p: any) => p.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'User already registered' });
        }

        // Check registration deadline
        if (contest.registrationDeadline && new Date() > new Date(contest.registrationDeadline)) {
            return res.status(400).json({ msg: 'Registration closed' });
        }

        contest.participants.push({ user: req.user.id });
        await contest.save();

        res.json(contest);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

// Get Contest Leaderboard
router.get('/:id/leaderboard', async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id)
            .populate('participants.user', 'username avatar')
            .select('participants');

        if (!contest) return res.status(404).json({ msg: 'Contest not found' });

        // Sort participants by score (desc) and finishTime (asc)
        const leaderboard = contest.participants.sort((a: any, b: any) => {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(a.finishTime).getTime() - new Date(b.finishTime).getTime();
        });

        res.json(leaderboard);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

// Seed Contests (Saturday/Sunday)
router.post('/seed', async (req, res) => {
    try {
        await Contest.deleteMany({});

        const now = new Date();
        const nextSaturday = new Date();
        nextSaturday.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);
        nextSaturday.setHours(18, 0, 0, 0); // 6 PM

        const nextSunday = new Date();
        nextSunday.setDate(now.getDate() + (7 - now.getDay() + 7) % 7);
        nextSunday.setHours(18, 0, 0, 0); // 6 PM

        const contests = [
            {
                title: "Weekly Code Mafia Showdown (Saturday)",
                description: "Join the weekly battle to prove your skills. Top performers get exclusive badges.",
                startTime: nextSaturday,
                endTime: new Date(nextSaturday.getTime() + 2 * 60 * 60 * 1000), // 2 hours
                registrationDeadline: new Date(nextSaturday.getTime() - 1 * 60 * 60 * 1000), // 1 hour before
                rules: [
                    "No cheating or plagiarism.",
                    "Each problem has equal weightage.",
                    "Tie-breaking based on finish time."
                ],
                prizes: ["Gold Badge", "Silver Badge", "Bronze Badge"],
                status: "Upcoming"
            },
            {
                title: "Sunday Speed Run",
                description: "Fast-paced contest for speed demons. Solve as many as you can in 90 minutes.",
                startTime: nextSunday,
                endTime: new Date(nextSunday.getTime() + 1.5 * 60 * 60 * 1000), // 1.5 hours
                registrationDeadline: new Date(nextSunday.getTime() - 1 * 60 * 60 * 1000),
                rules: [
                    "Speed is key.",
                    "Penalty for wrong submissions: 5 minutes."
                ],
                prizes: ["Speedster Badge"],
                status: "Upcoming"
            }
        ];

        await Contest.insertMany(contests);
        res.json({ msg: 'Seeded contests successfully' });
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

export default router;
