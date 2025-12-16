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
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Get Global Leaderboard
router.get('/global', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sort by mafiaRating (desc), then xp (desc)
        const users = yield User_1.default.find()
            .sort({ 'cpStats.mafiaRating': -1, xp: -1 })
            .limit(50)
            .select('username cpStats.mafiaRating xp solvedProblems streak avatar');
        // Transform data for frontend
        const leaderboard = users.map((user, index) => {
            var _a;
            return ({
                rank: index + 1,
                username: user.username,
                mafiaRating: ((_a = user.cpStats) === null || _a === void 0 ? void 0 : _a.mafiaRating) || 1200, // Default rating
                totalSolved: user.solvedProblems.length,
                streak: user.streak || 0,
                avatar: user.avatar
            });
        });
        res.json(leaderboard);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
