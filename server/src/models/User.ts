import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    contestHistory: [{
        contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' },
        rank: Number,
        ratingChange: Number
    }]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
