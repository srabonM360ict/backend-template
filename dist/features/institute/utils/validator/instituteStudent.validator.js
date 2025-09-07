"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../../../utils/miscellaneous/constants");
class InstituteStudentValidator {
    constructor() {
        this.createStudentSchema = joi_1.default.object({
            name: joi_1.default.string().max(255).required(),
            email: joi_1.default.string().email().lowercase().trim().max(255).optional(),
            password: joi_1.default.string().min(8).max(50).required(),
            phone: joi_1.default.string().min(6).max(20).optional(),
            department_id: joi_1.default.number().positive().required(),
            roll_no: joi_1.default.string()
                .pattern(/^[0-9]+$/)
                .max(10)
                .trim()
                .required(),
            batch_id: joi_1.default.number().positive().required(),
            branch_id: joi_1.default.number().positive().required(),
        });
        this.getAllStudentsSchema = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            status: joi_1.default.valid(...Object.values(constants_1.USER_STATUS)).optional(),
            filter: joi_1.default.string().optional(),
            start_date: joi_1.default.date().optional(),
            end_date: joi_1.default.date().optional(),
            semester_id: joi_1.default.number().positive().optional(),
            department_id: joi_1.default.number().positive().optional(),
        });
        this.updateStudentSchema = joi_1.default.object({
            name: joi_1.default.string().max(255).optional(),
            email: joi_1.default.string().email().lowercase().trim().max(255).optional(),
            phone: joi_1.default.string().min(6).max(20).optional(),
            password: joi_1.default.string().min(8).max(50).optional(),
            status: joi_1.default.valid(...Object.values(constants_1.USER_STATUS)).optional(),
            // department_id: Joi.number().positive().optional(),
            // roll_no: Joi.string()
            //   .pattern(/^[0-9]+$/)
            //   .max(10)
            //   .trim()
            //   .optional(),
            // batch_id: Joi.number().positive().optional(),
            // branch_id: Joi.number().positive().optional(),
        });
    }
}
exports.default = InstituteStudentValidator;
