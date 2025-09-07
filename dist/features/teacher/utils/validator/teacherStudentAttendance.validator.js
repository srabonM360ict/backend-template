"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherStudentAttendanceValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../../../utils/miscellaneous/constants");
class TeacherStudentAttendanceValidator {
    constructor() {
        this.takeStudentAttendanceSchema = joi_1.default.object({
            attendances: joi_1.default.array()
                .items(joi_1.default.object({
                enrollment_id: joi_1.default.number().required(),
                status: joi_1.default.string()
                    .valid(...Object.values(constants_1.ATTENDANCE_STATUS))
                    .required(),
            }))
                .required(),
            subject_offering_id: joi_1.default.number().required(),
            branch_id: joi_1.default.number().positive().required(),
            date: joi_1.default.date().required(),
            batch_semester_id: joi_1.default.number().required(),
        });
        this.updateStudentAttendanceSchema = joi_1.default.object({
            status: joi_1.default.string()
                .valid(...Object.values(constants_1.ATTENDANCE_STATUS))
                .required(),
        });
        this.getStudentAttendanceSchema = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            status: joi_1.default.string()
                .valid(...Object.values(constants_1.ATTENDANCE_STATUS))
                .optional(),
            start_date: joi_1.default.date().optional(),
            end_date: joi_1.default.date().optional(),
            subject_offering_id: joi_1.default.number().optional(),
        });
        this.getBatchAttendanceSchema = joi_1.default.object({
            date: joi_1.default.date().required(),
            subject_offering_id: joi_1.default.number().required(),
            branch_id: joi_1.default.number().optional(),
            status: joi_1.default.string()
                .valid(...Object.values(constants_1.ATTENDANCE_STATUS))
                .optional(),
        });
        this.getAllBranches = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            status: joi_1.default.boolean().optional(),
            filter: joi_1.default.string().optional(),
        });
    }
}
exports.TeacherStudentAttendanceValidator = TeacherStudentAttendanceValidator;
