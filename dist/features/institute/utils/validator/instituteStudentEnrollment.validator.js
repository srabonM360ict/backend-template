"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteStudentEnrollmentValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class InstituteStudentEnrollmentValidator {
    constructor() {
        this.createEnrollmentSchema = joi_1.default.object({
            student_id: joi_1.default.number().integer().required(),
            department_id: joi_1.default.number().integer().required(),
            batch_semester_id: joi_1.default.number().integer().required(),
            branch_id: joi_1.default.number().integer().min(1).required(),
            roll_no: joi_1.default.string()
                .pattern(/^[0-9]+$/)
                .max(10)
                .trim()
                .required(),
        });
        this.updateEnrollmentSchema = joi_1.default.object({
            roll_no: joi_1.default.string()
                .pattern(/^[0-9]+$/)
                .max(10)
                .trim()
                .required(),
            branch_id: joi_1.default.number().integer().optional(),
            batch_semester_id: joi_1.default.number().integer().optional(),
        }).min(1);
        this.getEnrollmentQuerySchema = joi_1.default.object({
            limit: joi_1.default.number().integer().min(1).optional(),
            skip: joi_1.default.number().integer().min(0).optional(),
            filter: joi_1.default.string().optional(),
            batch_semester_id: joi_1.default.number().integer().optional(),
            student_id: joi_1.default.number().integer().optional(),
            department_id: joi_1.default.number().integer().optional(),
        });
        this.getAttendanceSummarySchema = joi_1.default.object({
            limit: joi_1.default.number().integer().min(1).optional(),
            skip: joi_1.default.number().integer().min(0).optional(),
            start_date: joi_1.default.date().optional(),
            end_date: joi_1.default.date().optional(),
            department_id: joi_1.default.number().integer().positive().optional(),
            batch_semester_id: joi_1.default.number().integer().positive().optional(),
        });
    }
}
exports.InstituteStudentEnrollmentValidator = InstituteStudentEnrollmentValidator;
