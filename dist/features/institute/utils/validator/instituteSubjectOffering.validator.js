"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class InstituteSubjectOfferingValidator {
    constructor() {
        this.createSubjectOffering = joi_1.default.object({
            batch_semester_id: joi_1.default.number().positive().required(),
            department_id: joi_1.default.number().positive().required(),
            subject_teachers: joi_1.default.array()
                .items(joi_1.default.object({
                subject_id: joi_1.default.number().positive().required(),
                teacher_id: joi_1.default.number().positive().required(),
            }))
                .required(),
        });
        this.updateSubjectOffering = joi_1.default.object({
            batch_semester_id: joi_1.default.number().positive().optional(),
            subject_id: joi_1.default.number().positive().optional(),
            department_id: joi_1.default.number().positive().optional(),
            teacher_id: joi_1.default.number().positive().optional(),
        });
        this.getAllSubjectOfferings = joi_1.default.object({
            limit: joi_1.default.number().positive().optional(),
            skip: joi_1.default.number().positive().optional(),
            filter: joi_1.default.string().optional(),
            batch_semester_id: joi_1.default.number().positive().optional(),
        });
    }
}
exports.default = InstituteSubjectOfferingValidator;
