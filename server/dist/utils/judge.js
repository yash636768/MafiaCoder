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
exports.executeCode = void 0;
const axios_1 = __importDefault(require("axios"));
const PISTON_API = 'https://emkc.org/api/v2/piston';
const executeCode = (language, sourceCode, input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Map language names to Piston versions/names
        let lang = language.toLowerCase();
        let version = '*';
        if (lang === 'python')
            lang = 'python';
        if (lang === 'javascript' || lang === 'js')
            lang = 'javascript';
        if (lang === 'cpp' || lang === 'c++')
            lang = 'c++';
        if (lang === 'java')
            lang = 'java';
        const response = yield axios_1.default.post(`${PISTON_API}/execute`, {
            language: lang,
            version: version,
            files: [
                {
                    content: sourceCode
                }
            ],
            stdin: input
        });
        return response.data;
    }
    catch (error) {
        console.error("Piston Execution Error:", error);
        throw new Error('Execution failed');
    }
});
exports.executeCode = executeCode;
