"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteBatchValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../../../utils/miscellaneous/constants");
class InstituteBatchValidator {
    constructor() {
        this.createBatchSchema = joi_1.default.object({
            batch_name: joi_1.default.string().max(50).required(),
            department_id: joi_1.default.number().positive().required(),
            session_id: joi_1.default.number().positive().required(),
            start_date: joi_1.default.date().required(),
        });
        this.getAllBatchSchema = joi_1.default.object({
            filter: joi_1.default.string().max(50).optional(),
            department_id: joi_1.default.number().positive().optional(),
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
        });
        this.getSingleBatchSemesterSchema = joi_1.default.object({
            status: joi_1.default.string()
                .valid(...Object.values(constants_1.SEMESTER_STATUS))
                .optional(),
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            filter: joi_1.default.string().max(50).optional(),
        });
        this.updateBatchSchema = joi_1.default.object({
            batch_name: joi_1.default.string().max(50).optional(),
            department_id: joi_1.default.number().positive().optional(),
            session_id: joi_1.default.number().positive().optional(),
            start_date: joi_1.default.date().optional(),
            status: joi_1.default.boolean().optional(),
        });
    }
}
exports.InstituteBatchValidator = InstituteBatchValidator;
