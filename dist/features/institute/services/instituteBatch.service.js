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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteBatchService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class InstituteBatchService extends abstract_service_1.default {
    createBatch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id } = req.institute;
                const body = __rest(req.body, []);
                const departmentModel = this.Model.DepartmentModel(trx);
                const batchModel = this.Model.BatchModel(trx);
                const sessionModel = this.Model.SessionModel(trx);
                const { data: checkAlreadyExists } = yield batchModel.getAllBatch({
                    institute_id,
                    batch_name: body.batch_name,
                    department_id: body.department_id,
                });
                if (checkAlreadyExists.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Batch name already exists",
                    };
                }
                const session = yield sessionModel.getAllSessions({
                    id: body.session_id,
                    institute_id,
                });
                if (!session.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Session not found",
                    };
                }
                const department = yield departmentModel.getAllDepartments({
                    id: body.department_id,
                    institute_id,
                });
                if (!department.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Department not found",
                    };
                }
                const batch = yield batchModel.createBatch({
                    batch_name: body.batch_name,
                    session_id: body.session_id,
                    department_id: body.department_id,
                    institute_id,
                    start_date: body.start_date,
                    created_by: user_id,
                });
                yield this.insertInstituteAudit(trx, {
                    details: `New batch ${body.batch_name} has been created`,
                    institute_id,
                    created_by: user_id,
                    endpoint: req.originalUrl,
                    type: "create",
                    payload: JSON.stringify(body),
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: batch,
                };
            }));
        });
    }
    getAllBatch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const query = req.query;
            const model = this.Model.BatchModel();
            const data = yield model.getAllBatch(Object.assign(Object.assign({}, query), { institute_id }), true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    getSingleBatch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id } = req.institute;
            const query = req.query;
            const model = this.Model.BatchModel();
            const data = yield model.getSingleBatch(id, institute_id);
            if (!data) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const batchSemesterModel = this.Model.BatchWiseSemesterModel();
            const semesters = yield batchSemesterModel.getBatchWiseSemester(Object.assign(Object.assign({}, query), { batch_id: id, institute_id }));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: Object.assign(Object.assign({}, data), { semesters: semesters.data }),
            };
        });
    }
    updateBatch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id, user_id } = req.institute;
            const body = __rest(req.body, []);
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const batchModel = this.Model.BatchModel(trx);
                const checkBatch = yield batchModel.getSingleBatch(id, institute_id);
                if (!checkBatch) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                if (body.batch_name) {
                    const checkAlreadyExists = yield batchModel.getAllBatch({
                        institute_id,
                        batch_name: body.batch_name,
                        department_id: checkBatch.department_id,
                    });
                    if (checkAlreadyExists.data.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Batch name already exists",
                        };
                    }
                }
                yield batchModel.updateBatch(Object.assign({}, body), id);
                yield this.insertInstituteAudit(trx, {
                    details: `Batch ${checkBatch.batch_name} has been updated`,
                    institute_id,
                    created_by: user_id,
                    endpoint: req.originalUrl,
                    type: "update",
                    payload: JSON.stringify(body),
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    deleteBatch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id, user_id } = req.institute;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const batchModel = this.Model.BatchModel(trx);
                const batchWiseSemesterModel = this.Model.BatchWiseSemesterModel(trx);
                const checkBatch = yield batchModel.getSingleBatch(id, institute_id);
                if (!checkBatch) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const check = yield batchWiseSemesterModel.getBatchWiseSemester({
                    batch_id: id,
                    institute_id,
                });
                if (check.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Batch is associated with semesters",
                    };
                }
                yield batchModel.deleteBatch(id);
                yield this.insertInstituteAudit(trx, {
                    details: `Batch ${checkBatch.batch_name} has been deleted`,
                    institute_id,
                    created_by: user_id,
                    endpoint: req.originalUrl,
                    type: "delete",
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
}
exports.InstituteBatchService = InstituteBatchService;
