import mongoose from 'mongoose';

const ContestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    registrationDeadline: { type: Date },
    rules: [{ type: String }],
    prizes: [{ type: String }],
    problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    participants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number, default: 0 },
        finishTime: { type: Date } // For tie-breaking
    }],
    status: { type: String, enum: ['Upcoming', 'Live', 'Ended'], default: 'Upcoming' }
}, { timestamps: true });

export default mongoose.model('Contest', ContestSchema);
