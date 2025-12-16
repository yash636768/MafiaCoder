"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubmissionSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Problem', required: true },
    contest: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Contest' }, // Optional
    code: { type: String, required: true },
    language: { type: String, required: true },
    verdict: { type: String, enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Pending'], default: 'Pending' },
    score: { type: Number, default: 0 },
    runtime: { type: Number }, // in ms
    memory: { type: Number }, // in KB
    testCasesPassed: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Submission', SubmissionSchema);
