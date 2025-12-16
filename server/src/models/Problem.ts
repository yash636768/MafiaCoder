import mongoose from 'mongoose';

const ProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    tags: [{ type: String }],
    companies: [{ type: String }], // Google, Amazon, etc.

    // Content
    inputFormat: { type: String },
    outputFormat: { type: String },
    constraints: { type: String },
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],

    // For Judge
    testCases: [{
        input: String,
        output: String,
        isHidden: { type: Boolean, default: true }
    }],

    // Metadata
    acceptanceRate: { type: Number, default: 0 },
    submissions: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    // Solution/Editorial
    editorial: { type: String },
    hints: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Problem', ProblemSchema);
