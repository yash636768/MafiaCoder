"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database Connection
mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mafiacoder')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
const auth_1 = __importDefault(require("./routes/auth"));
const problems_1 = __importDefault(require("./routes/problems"));
const contests_1 = __importDefault(require("./routes/contests"));
const leaderboard_1 = __importDefault(require("./routes/leaderboard"));
const ai_1 = __importDefault(require("./routes/ai"));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/problems', problems_1.default);
app.use('/api/contests', contests_1.default);
app.use('/api/leaderboard', leaderboard_1.default);
app.use('/api/ai', ai_1.default);
app.get('/', (req, res) => {
    res.send('MafiaCoder Backend is Running');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
