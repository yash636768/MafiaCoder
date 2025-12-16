"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProblemSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('Problem', ProblemSchema);
