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
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class InstituteBranchService extends abstract_service_1.default {
    createBranch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const body = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const instituteModel = this.Model.InstituteModel(trx);
                const branchModel = this.Model.BranchModel(trx);
                const { data: checkAlreadyExists } = yield branchModel.getAllBranch({
                    name: body.name,
                    institute_id,
                });
                if (checkAlreadyExists.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Branch no already exists",
                    };
                }
                const branch = yield branchModel.createBranch(Object.assign(Object.assign({}, body), { created_by: user_id, institute_id }));
                yield this.insertInstituteAudit(trx, {
                    details: `New branch ${body.name} has been created`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "create",
                    created_by: user_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: branch,
                };
            }));
        });
    }
    getBranches(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const { limit, skip, status, filter } = req.query;
            const model = this.Model.BranchModel();
            const data = yield model.getAllBranch({ limit, skip, status, institute_id, filter }, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    getSingleBranch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id } = req.institute;
            const model = this.Model.BranchModel();
            const data = yield model.getAllBranch({ id, institute_id });
            if (!data.data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: data,
            };
        });
    }
    updateBranch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const body = req.body;
                const { institute_id } = req.institute;
                const model = this.Model.BranchModel(trx);
                const check = yield model.getAllBranch({
                    id,
                    institute_id,
                });
                if (!check.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                if (body.name) {
                    const checkAlreadyExists = yield model.getAllBranch({
                        name: body.name,
                        institute_id,
                    });
                    if (checkAlreadyExists.data.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Branch no already exists",
                        };
                    }
                }
                const data = yield model.updateBranch(body, id);
                yield this.insertInstituteAudit(trx, {
                    details: `Branch ${check.data[0].name} has been updated`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "update",
                    payload: req.body,
                    created_by: req.institute.user_id,
                });
                return {
                    success: true,
                    message: this.ResMsg.HTTP_OK,
                    code: this.StatusCode.HTTP_OK,
                    data: data,
                };
            }));
        });
    }
    deleteBranch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id } = req.institute;
                const model = this.Model.BranchModel(trx);
                const enrollment = this.Model.StudentEnrollmentModel(trx);
                const check = yield model.getAllBranch({
                    id,
                    institute_id,
                });
                if (!check.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const checkEnrollment = yield enrollment.getAllEnrollments({
                    branch_id: id,
                    institute_id,
                });
                if (checkEnrollment.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Branch is being used in student enrollment",
                    };
                }
                const data = yield model.deleteBranch(id);
                yield this.insertInstituteAudit(trx, {
                    details: `Branch ${check.data[0].name} has been deleted`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "delete",
                    created_by: user_id,
                });
                return {
                    success: true,
                    message: this.ResMsg.HTTP_OK,
                    code: this.StatusCode.HTTP_OK,
                    data: data,
                };
            }));
        });
    }
}
exports.default = InstituteBranchService;
