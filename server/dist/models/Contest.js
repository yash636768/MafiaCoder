"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ContestSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    registrationDeadline: { type: Date },
    rules: [{ type: String }],
    prizes: [{ type: String }],
    problems: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Problem' }],
    participants: [{
            user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
            score: { type: Number, default: 0 },
            finishTime: { type: Date } // For tie-breaking
        }],
    status: { type: String, enum: ['Upcoming', 'Live', 'Ended'], default: 'Upcoming' }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Contest', ContestSchema);
