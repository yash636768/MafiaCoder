"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Contest_1 = __importDefault(require("../models/Contest"));
const Problem_1 = __importDefault(require("../models/Problem"));
const Submission_1 = __importDefault(require("../models/Submission"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const judge_1 = require("../utils/judge");
const router = express_1.default.Router();
// Middleware to get user (should be shared)
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
// Get All Contests
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contests = yield Contest_1.default.find().sort({ startTime: -1 });
        res.json(contests);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Create Contest (Admin)
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newContest = new Contest_1.default(req.body);
        const contest = yield newContest.save();
        res.json(contest);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Submit Solution
router.post('/submit', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { problemId, contestId, code, language } = req.body;
        const userId = req.user.id;
        const problem = yield Problem_1.default.findById(problemId);
        if (!problem)
            return res.status(404).json({ msg: 'Problem not found' });
        // Create Submission
        const submission = new Submission_1.default({
            user: userId,
            problem: problemId,
            contest: contestId,
            code,
            language,
            verdict: 'Pending'
        });
        yield submission.save();
        // Run Judge
        let passed = 0;
        let total = problem.testCases.length;
        let verdict = 'Accepted';
        for (const testCase of problem.testCases) {
            try {
                const result = yield (0, judge_1.executeCode)(language, code, testCase.input || '');
                if (result.run.code !== 0) {
                    verdict = 'Runtime Error'; // Or Compilation Error
                    if (result.compile && result.compile.code !== 0)
                        verdict = 'Compilation Error';
                    break;
                }
                // Simple trim comparison
                if (result.run.stdout.trim() !== (testCase.output || '').trim()) {
                    verdict = 'Wrong Answer';
                    break;
                }
                passed++;
            }
            catch (err) {
                verdict = 'Runtime Error';
                break;
            }
        }
        submission.verdict = verdict;
        submission.testCasesPassed = passed;
        submission.totalTestCases = total;
        yield submission.save();
        // Update User Stats (Simplified)
        if (verdict === 'Accepted') {
            yield User_1.default.findByIdAndUpdate(userId, {
                $addToSet: { solvedProblems: problemId },
                $inc: { xp: 10, streak: 1 }
            });
        }
        res.json(submission);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Register for Contest
router.post('/:id/register', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contest = yield Contest_1.default.findById(req.params.id);
        if (!contest)
            return res.status(404).json({ msg: 'Contest not found' });
        // Check if already registered
        if (contest.participants.some((p) => p.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'User already registered' });
        }
        // Check registration deadline
        if (contest.registrationDeadline && new Date() > new Date(contest.registrationDeadline)) {
            return res.status(400).json({ msg: 'Registration closed' });
        }
        contest.participants.push({ user: req.user.id });
        yield contest.save();
        res.json(contest);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Get Contest Leaderboard
router.get('/:id/leaderboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contest = yield Contest_1.default.findById(req.params.id)
            .populate('participants.user', 'username avatar')
            .select('participants');
        if (!contest)
            return res.status(404).json({ msg: 'Contest not found' });
        // Sort participants by score (desc) and finishTime (asc)
        const leaderboard = contest.participants.sort((a, b) => {
            if (b.score !== a.score)
                return b.score - a.score;
            return new Date(a.finishTime).getTime() - new Date(b.finishTime).getTime();
        });
        res.json(leaderboard);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Seed Contests (Saturday/Sunday)
router.post('/seed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Contest_1.default.deleteMany({});
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
        yield Contest_1.default.insertMany(contests);
        res.json({ msg: 'Seeded contests successfully' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
