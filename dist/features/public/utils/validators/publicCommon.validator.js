"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class PublicCommonValidator {
    constructor() {
        this.singleParamNumValidator = (idFieldName = "id") => {
            const schemaObject = {};
            schemaObject[idFieldName] = joi_1.default.number().required();
            return joi_1.default.object(schemaObject);
        };
        // single param string validator
        this.singleParamStringValidator = (idFieldName = "id") => {
            const schemaObject = {};
            schemaObject[idFieldName] = joi_1.default.string().required();
            return joi_1.default.object(schemaObject);
        };
        // common login input validator
        this.loginValidator = joi_1.default.object({
            login_id_or_email: joi_1.default.string().max(255).required().lowercase().messages({
                "string.base": "Enter valid login_id or email",
                "any.required": "login_id or email is required",
            }),
            password: joi_1.default.string().min(8).required().messages({
                "string.base": "Enter valid password",
                "string.min": "Enter valid password minimum length 8",
                "any.required": "Password is required",
            }),
        });
        this.loginIDValidator = joi_1.default.object({
            login_id: joi_1.default.string().max(255).required().lowercase().messages({
                "string.base": "Enter valid Login ID",
                "any.required": "Login ID is required",
            }),
            password: joi_1.default.string().min(8).required().messages({
                "string.base": "Enter valid password",
                "string.min": "Enter valid password minimum length 8",
                "any.required": "Password is required",
            }),
        });
        // common forget password input validator
        this.commonForgetPassInputValidation = joi_1.default.object({
            token: joi_1.default.string().required().messages({
                "string.base": "Provide valid token",
                "any.required": "Token is required",
            }),
            email: joi_1.default.string().email().optional().lowercase().messages({
                "string.base": "Provide valid email",
                "string.email": "Provide valid email",
            }),
            password: joi_1.default.string().min(8).required().messages({
                "string.base": "Provide valid password",
                "string.min": "Please provide valid password that's length must be min 8",
                "any.required": "Password is required",
            }),
        });
        this.commonTwoFAInputValidation = joi_1.default.object({
            token: joi_1.default.string().required().messages({
                "string.base": "Provide valid token",
                "any.required": "Token is required",
            }),
            email: joi_1.default.string().email().optional().lowercase().messages({
                "string.base": "Provide valid email",
                "string.email": "Provide valid email",
            }),
        });
        // common change password input validation
        this.changePassInputValidation = joi_1.default.object({
            old_password: joi_1.default.string().min(8).required().messages({
                "string.base": "Provide a valid old password",
                "string.min": "Provide a valid old password minimum length is 8",
                "any.required": "Old password is required",
            }),
            new_password: joi_1.default.string().min(8).required().messages({
                "string.base": "Provide a valid new password",
                "string.min": "Provide a valid new password minimum length is 8",
                "any.required": "New password is required",
            }),
        });
        this.getNotificationValidator = joi_1.default.object({
            limit: joi_1.default.number().integer().positive().optional(),
            skip: joi_1.default.number().integer().positive().optional(),
        });
        this.mutationNotificationValidator = joi_1.default.object({
            id: joi_1.default.number().integer().positive().optional(),
        });
        // get single item with id validator
        this.getSingleItemWithIdValidator = joi_1.default.object({
            id: joi_1.default.number().integer().required(),
        });
    }
    // multiple params number validator
    multipleParamsNumValidator(fields) {
        const schemaObject = {};
        fields.forEach((item) => {
            schemaObject[item] = joi_1.default.number().required();
        });
        return joi_1.default.object(schemaObject);
    }
    // multiple params string validator
    multipleParamsStringValidator(fields) {
        const schemaObject = {};
        fields.forEach((item) => {
            schemaObject[item] = joi_1.default.number().required();
        });
        return joi_1.default.object(schemaObject);
    }
}
exports.default = PublicCommonValidator;
