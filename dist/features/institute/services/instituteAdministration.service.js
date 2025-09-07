"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteAdministrationService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class InstituteAdministrationService extends abstract_service_1.default {
    getAuditData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const { limit, skip, created_by, from_date, to_date, type } = req.query;
            const instituteAdministrationModel = this.Model.InstituteModel();
            const data = yield instituteAdministrationModel.getAudit({
                institute_id,
                limit,
                skip,
                created_by,
                from_date,
                to_date,
                type,
            });
            return Object.assign({ success: true, code: this.StatusCode.HTTP_OK, message: this.ResMsg.HTTP_OK }, data);
        });
    }
    getErrorLogs(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const { limit, skip, from_date, to_date } = req.query;
            const instituteAdministrationModel = this.Model.InstituteModel();
            const data = yield instituteAdministrationModel.getErrorLogs({
                institute_id,
                limit,
                skip,
                from_date,
                to_date,
            });
            return Object.assign({ success: true, code: this.StatusCode.HTTP_OK, message: this.ResMsg.HTTP_OK }, data);
        });
    }
}
exports.InstituteAdministrationService = InstituteAdministrationService;
