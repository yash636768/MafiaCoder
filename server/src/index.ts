import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mafiacoder')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

import authRoutes from './routes/auth';
import problemRoutes from './routes/problems';
import contestRoutes from './routes/contests';
import leaderboardRoutes from './routes/leaderboard';
import aiRoutes from './routes/ai';
import compilerRoutes from './routes/compiler';
import dashboardRoutes from './routes/dashboard';
import profileRoutes from './routes/profile';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('MafiaCoder Backend is Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
