"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class InstituteBranchValidator {
    constructor() {
        this.createBranch = joi_1.default.object({
            name: joi_1.default.string().max(20).required(),
        });
        this.updateBranch = joi_1.default.object({
            name: joi_1.default.string().max(10).optional(),
            status: joi_1.default.boolean().optional(),
        }).or("name", "status");
        this.getAllBranches = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            status: joi_1.default.boolean().optional(),
            filter: joi_1.default.string().max(10).optional(),
        });
    }
}
exports.default = InstituteBranchValidator;
