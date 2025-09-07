"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../../../utils/miscellaneous/constants");
class InstituteTeacherValidator {
    constructor() {
        this.createTeacherSchema = joi_1.default.object({
            name: joi_1.default.string().max(255).required(),
            email: joi_1.default.string().email().lowercase().trim().max(255).required(),
            password: joi_1.default.string().min(8).max(50).required(),
            phone: joi_1.default.string().min(6).max(20).required(),
            teacher_id: joi_1.default.string().min(6).max(50).trim().required(),
            department_id: joi_1.default.number().positive().required(),
            is_main: joi_1.default.boolean().optional(),
        });
        this.getAllTeachersSchema = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            status: joi_1.default.boolean().optional(),
            filter: joi_1.default.string().optional(),
            start_date: joi_1.default.date().optional(),
            end_date: joi_1.default.date().optional(),
            department_id: joi_1.default.number().positive().optional(),
        });
        this.updateTeacherSchema = joi_1.default.object({
            name: joi_1.default.string().max(255).optional(),
            email: joi_1.default.string().email().lowercase().trim().max(255).optional(),
            phone: joi_1.default.string().min(6).max(20).optional(),
            password: joi_1.default.string().min(8).max(50).optional(),
            status: joi_1.default.valid(...Object.values(constants_1.USER_STATUS)).optional(),
        });
    }
}
exports.default = InstituteTeacherValidator;
