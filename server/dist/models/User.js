"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    googleId: { type: String },
    githubId: { type: String },
    avatar: { type: String, default: 'https://i.imgur.com/6VBx3io.png' }, // Default mafia avatar
    bio: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // Profile Details
    skills: [{ type: String }],
    college: { type: String },
    socials: {
        linkedin: String,
        github: String,
        twitter: String,
        website: String
    },
    // Gamification
    mafiaLevel: { type: String, default: 'Rookie' }, // Rookie, Spy, Assassin, Underboss, Don
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    // CP Stats (Synced)
    cpStats: {
        leetcode: { rating: Number, solved: Number },
        codeforces: { rating: Number, solved: Number },
        codechef: { rating: Number, solved: Number },
        hackerrank: { rating: Number, solved: Number },
        atcoder: { rating: Number, solved: Number },
        geeksforgeeks: { rating: Number, solved: Number },
        mafiaRating: { type: Number, default: 0 } // Weighted average
    },
    // Platform Stats
    solvedProblems: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Problem' }],
    contestHistory: [{
            contestId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Contest' },
            rank: Number,
            ratingChange: Number
        }]
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', UserSchema);
