"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class InstituteAdministrationValidator {
    constructor() {
        //Role validation
        this.createRole = joi_1.default.object({
            role_name: joi_1.default.string().required(),
            permissions: joi_1.default.array()
                .items({
                permission_id: joi_1.default.number().required(),
                read: joi_1.default.number().valid(0, 1).required(),
                update: joi_1.default.number().valid(0, 1).required(),
                write: joi_1.default.number().valid(0, 1).required(),
                delete: joi_1.default.number().valid(0, 1).required(),
            })
                .required(),
        });
        //Permission validation
        this.createPermission = joi_1.default.object({
            permission_name: joi_1.default.string().min(1).max(255).required(),
        });
        //Update role permissions validator
        this.updateRolePermissions = joi_1.default.object({
            role_name: joi_1.default.string().optional(),
            status: joi_1.default.number().valid(0, 1).optional(),
            add_permissions: joi_1.default.array()
                .items({
                permission_id: joi_1.default.number().required(),
                read: joi_1.default.number().valid(0, 1).required(),
                update: joi_1.default.number().valid(0, 1).required(),
                write: joi_1.default.number().valid(0, 1).required(),
                delete: joi_1.default.number().valid(0, 1).required(),
            })
                .optional(),
        });
        //create institute
        this.createInstitute = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().email().lowercase().required(),
            password: joi_1.default.string().min(8).required(),
            phone: joi_1.default.string().required(),
            role_id: joi_1.default.number().required(),
        });
        // Create B2B Institute validator
        this.createB2bInstitute = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().email().lowercase().required(),
            password: joi_1.default.string().min(8).required(),
            mobile_number: joi_1.default.string().required(),
            role_id: joi_1.default.number().required(),
        });
        // Update B2B institute
        this.updateB2bInstitute = joi_1.default.object({
            name: joi_1.default.string(),
            email: joi_1.default.string().email().lowercase(),
            password: joi_1.default.string().min(8),
            mobile_number: joi_1.default.string(),
            role_id: joi_1.default.number(),
        });
        //get all Institute query validator
        this.getAllInstituteQueryValidator = joi_1.default.object({
            filter: joi_1.default.string(),
            role: joi_1.default.number(),
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
            status: joi_1.default.string(),
        });
        //update institute
        this.updateInstitute = joi_1.default.object({
            login_id: joi_1.default.string(),
            name: joi_1.default.string(),
            phone: joi_1.default.string(),
            role_id: joi_1.default.number(),
            status: joi_1.default.boolean(),
            is_2fa_on: joi_1.default.boolean().optional(),
        });
        //get users filter validator
        this.getUsersFilterValidator = joi_1.default.object({
            filter: joi_1.default.string(),
            status: joi_1.default.boolean(),
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
        });
        //update user profile
        this.editUserProfileValidator = joi_1.default.object({
            // login_id: Joi.string().min(6).max(255).optional(),
            is_2fa_on: joi_1.default.boolean().optional(),
            name: joi_1.default.string().optional(),
            phone: joi_1.default.string().min(6).max(255).optional(),
            email: joi_1.default.string().email().lowercase().optional(),
        });
        //create city
        this.createCityValidator = joi_1.default.object({
            country_id: joi_1.default.number().required(),
            name: joi_1.default.string().required(),
        });
        this.getAuditLogsValidator = joi_1.default.object({
            start_date: joi_1.default.date().optional(),
            end_date: joi_1.default.date().optional(),
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            created_by: joi_1.default.number().optional(),
            type: joi_1.default.string().valid("create", "update", "delete").optional(),
        });
        this.getErrorLogsValidator = joi_1.default.object({
            start_date: joi_1.default.date().optional(),
            end_date: joi_1.default.date().optional(),
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
        });
    }
}
exports.default = InstituteAdministrationValidator;
