"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class InstituteSessionValidator {
    constructor() {
        this.createSession = joi_1.default.object({
            session_no: joi_1.default.string().max(10).required(),
        });
        this.updateSession = joi_1.default.object({
            session_no: joi_1.default.string().max(10).optional(),
            status: joi_1.default.boolean().optional(),
        }).or("session_no", "status");
        this.getAllSessions = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            status: joi_1.default.boolean().optional(),
            session_no: joi_1.default.string().max(10).optional(),
        });
    }
}
exports.default = InstituteSessionValidator;
