"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherProfileValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../../../utils/miscellaneous/constants");
class TeacherProfileValidator {
    constructor() {
        this.editProfileSchema = joi_1.default.object({
            name: joi_1.default.string().max(255).optional(),
            email: joi_1.default.string().email().trim().lowercase().max(255).optional(),
            phone: joi_1.default.string().min(6).max(20).optional(),
            is_2fa_on: joi_1.default.boolean().optional(),
            dob_date: joi_1.default.date().optional(),
            dob_no: joi_1.default.string().max(50).optional(),
            religion: joi_1.default.string()
                .valid(...constants_1.RELIGIONS)
                .optional(),
            gender: joi_1.default.string()
                .valid(...Object.values(constants_1.GENDER))
                .optional(),
            blood_group: joi_1.default.string()
                .valid(...constants_1.BLOOD_GROUP)
                .optional(),
            permanent_address: joi_1.default.string().max(255).optional(),
            father_name: joi_1.default.string().max(255).optional(),
            mother_name: joi_1.default.string().max(255).optional(),
            present_address: joi_1.default.string().max(255).optional(),
            emergency_phone_no: joi_1.default.string().min(6).max(20).optional(),
        });
    }
}
exports.TeacherProfileValidator = TeacherProfileValidator;
