"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../../../utils/miscellaneous/constants");
class ManagementInstituteValidator {
    constructor() {
        this.instituteSchema = joi_1.default.object({
            institution_code: joi_1.default.string().optional(),
            established_year: joi_1.default.number()
                .integer()
                .min(1800)
                .max(new Date().getFullYear())
                .optional(),
            name: joi_1.default.string().trim().min(1).max(150).optional(),
            phone: joi_1.default.string().trim().optional(),
            email: joi_1.default.string().trim().email().optional(),
            website: joi_1.default.string().trim().optional(),
            category: joi_1.default.string().trim().optional(),
            ownership: joi_1.default.string().trim().optional(),
            address: joi_1.default.string().trim().optional(),
            postal_code: joi_1.default.string().max(4).optional(),
        }).optional();
        this.instituteHeadSchema = joi_1.default.object({
            name: joi_1.default.string().trim().min(1).max(150).optional(),
            email: joi_1.default.string().trim().email().optional(),
            password: joi_1.default.string().trim().optional(),
            phone: joi_1.default.string().trim().optional(),
            gender: joi_1.default.string()
                .valid(...Object.values(constants_1.GENDER))
                .optional(),
            blood_group: joi_1.default.string()
                .valid(...constants_1.BLOOD_GROUP)
                .optional(),
            nid: joi_1.default.string().pattern(constants_1.bdNidPattern).optional(),
        }).optional();
        this.instituteRegistration = joi_1.default.object({
            institute: joi_1.default.string()
                .required()
                .custom((value, helpers) => {
                try {
                    const parsed = JSON.parse(value);
                    const { error } = this.instituteSchema.validate(parsed, {
                        abortEarly: false,
                    });
                    if (error) {
                        return helpers.error("any.invalid", {
                            message: error.details.map((d) => d.message),
                        });
                    }
                    return parsed;
                }
                catch (_a) {
                    return helpers.error("any.invalid", {
                        message: ["Institute must be a valid JSON string"],
                    });
                }
            }),
            instituteHead: joi_1.default.string()
                .required()
                .custom((value, helpers) => {
                try {
                    const parsed = JSON.parse(value);
                    const { error } = this.instituteHeadSchema.validate(parsed, {
                        abortEarly: false,
                    });
                    if (error) {
                        return helpers.error("any.invalid", {
                            message: error.details.map((d) => d.message),
                        });
                    }
                    return parsed;
                }
                catch (_a) {
                    return helpers.error("any.invalid", {
                        message: ["InstituteHead must be a valid JSON string"],
                    });
                }
            }),
        });
        this.getAllInstituteQuery = joi_1.default.object({
            institution_code: joi_1.default.alternatives()
                .try(joi_1.default.number().integer().min(1), joi_1.default.string().pattern(/^\d+$/))
                .optional(),
            name: joi_1.default.string().trim().min(1).max(150).optional(),
            email: joi_1.default.string().trim().lowercase().email().optional(),
            phone: joi_1.default.string().trim().pattern(constants_1.bdPhone).optional().messages({
                "string.pattern.base": "phone must be an 11-digit Bangladeshi number starting with 01",
            }),
            limit: joi_1.default.number().integer().optional(),
            skip: joi_1.default.number().integer().optional(),
        });
        this.updateInstituteValidator = joi_1.default.object({
            institute: joi_1.default.string()
                .optional()
                .custom((value, helpers) => {
                const errors = [];
                let parsed;
                try {
                    parsed = JSON.parse(value);
                    console.log({ parsed });
                }
                catch (_a) {
                    errors.push("Institute must be a valid JSON string");
                    // return helpers.error("any.invalid", { message: errors });
                }
                const { error } = this.instituteSchema.validate(parsed, {
                    abortEarly: false,
                    presence: "optional",
                });
                if (error) {
                    error.details.forEach((d) => errors.push(d.message));
                }
                if (errors.length) {
                    return helpers.error("any.invalid", { message: errors });
                }
                return parsed;
            }),
        });
    }
}
exports.default = ManagementInstituteValidator;
