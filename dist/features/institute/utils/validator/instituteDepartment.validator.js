"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../../../utils/miscellaneous/constants");
class InstituteDepartmentValidator {
    constructor() {
        this.createDepartment = joi_1.default.object({
            name: joi_1.default.string().required(),
            code: joi_1.default.number().positive().max(99).required(),
            short_name: joi_1.default.string().min(2).max(3).trim().uppercase().required(),
            department_head_id: joi_1.default.number().optional(),
        });
        this.updateDepartment = joi_1.default.object({
            name: joi_1.default.string().optional(),
            department_head_id: joi_1.default.number().optional(),
            status: joi_1.default.boolean().optional(),
        });
        this.getAllDepartments = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            status: joi_1.default.boolean().optional(),
        });
        this.getSingleDepartments = joi_1.default.object({
            start_date: joi_1.default.date().optional(),
            end_date: joi_1.default.date().optional(),
            semester_status: joi_1.default.string()
                .valid(...Object.values(constants_1.SEMESTER_STATUS))
                .optional(),
        });
    }
}
exports.default = InstituteDepartmentValidator;
