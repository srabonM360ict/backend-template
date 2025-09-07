"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class InstituteSemesterValidator {
    constructor() {
        this.createSemester = joi_1.default.object({
            // department_id: Joi.number().positive().required(),
            name: joi_1.default.string().required(),
            // start_date: Joi.date().required(),
            // end_date: Joi.date().required(),
            // session: Joi.string().max(10).required(),
            // students: Joi.array()
            //   .items(
            //     Joi.object({
            //       student_id: Joi.number().positive().required(),
            //       roll_no: Joi.string().max(10).trim().required(),
            //     }).required()
            //   )
            //   .optional(),
            // subjects: Joi.array()
            //   .items(
            //     Joi.object({
            //       subject_id: Joi.number().positive().required(),
            //       teacher_id: Joi.number().positive().required(),
            //     })
            //   )
            //   .optional(),
        });
        this.singleSemesterQuery = joi_1.default.object({
            name: joi_1.default.string().optional(),
            // start_date: Joi.date().optional(),
            // department_id: Joi.number().positive().optional(),
            // end_date: Joi.date().optional(),
            status: joi_1.default.boolean().optional(),
        });
        this.updateSemester = joi_1.default.object({
            name: joi_1.default.string().optional(),
            // start_date: Joi.date().optional(),
            // department_id: Joi.number().positive().optional(),
            // end_date: Joi.date().optional(),
            status: joi_1.default.boolean().optional(),
        });
        this.getAllSemesters = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            status: joi_1.default.boolean().optional(),
            // start_date: Joi.date().optional(),
            // end_date: Joi.date().optional(),
            // department_id: Joi.number().positive().optional(),
            // semester_status: Joi.string()
            //   .valid(...Object.values(SEMESTER_STATUS))
            //   .optional(),
        });
    }
}
exports.default = InstituteSemesterValidator;
