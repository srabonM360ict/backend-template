"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class InstituteSubjectValidator {
    constructor() {
        this.createSubject = joi_1.default.object({
            name: joi_1.default.string().required(),
            code: joi_1.default.string().max(10).required(),
            teacher_id: joi_1.default.number().optional(),
        });
        this.updateSubject = joi_1.default.object({
            name: joi_1.default.string().optional(),
            teacher_id: joi_1.default.number().optional(),
            code: joi_1.default.string().max(10).optional(),
            status: joi_1.default.boolean().optional(),
        });
        this.getAllSubjects = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            status: joi_1.default.boolean().optional(),
            code: joi_1.default.string().max(10).optional(),
        });
    }
}
exports.default = InstituteSubjectValidator;
