import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    contest: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }, // Optional
    code: { type: String, required: true },
    language: { type: String, required: true },
    verdict: { type: String, enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Pending'], default: 'Pending' },
    score: { type: Number, default: 0 },
    runtime: { type: Number }, // in ms
    memory: { type: Number }, // in KB
    testCasesPassed: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Submission', SubmissionSchema);
