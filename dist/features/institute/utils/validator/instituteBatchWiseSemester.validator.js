"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteBatchWiseSemesterValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../../../utils/miscellaneous/constants");
class InstituteBatchWiseSemesterValidator {
    constructor() {
        this.createBatchWiseSemesterSchema = joi_1.default.object({
            batch_id: joi_1.default.number().positive().required(),
            semester_id: joi_1.default.number().positive().required(),
            start_date: joi_1.default.date().optional(),
            end_date: joi_1.default.date().optional(),
            is_migration: joi_1.default.boolean().optional(),
        });
        this.getAllBatchWiseSemesterSchema = joi_1.default.object({
            filter: joi_1.default.string().optional(),
            department_id: joi_1.default.number().positive().optional(),
            start_date: joi_1.default.date().optional(),
            end_date: joi_1.default.date().optional(),
            status: joi_1.default.string()
                .valid(...Object.values(constants_1.SEMESTER_STATUS))
                .optional(),
            batch_id: joi_1.default.number().min(1).optional(),
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
        });
        this.updateBatchWiseSemesterSchema = joi_1.default.object({
            start_date: joi_1.default.date().required(),
            end_date: joi_1.default.date().required(),
        });
        //   public updateBatchWiseSemesterSchema = Joi.object({
        //     batch_name: Joi.string().max(50).optional(),
        //     department_id: Joi.number().positive().optional(),
        //     session_id: Joi.number().positive().optional(),
        //     start_date: Joi.date().optional(),
        //     status: Joi.boolean().optional(),
        //   });
    }
}
exports.InstituteBatchWiseSemesterValidator = InstituteBatchWiseSemesterValidator;
