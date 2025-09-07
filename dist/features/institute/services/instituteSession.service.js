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
class InstituteSessionService extends abstract_service_1.default {
    createSession(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const body = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const instituteModel = this.Model.InstituteModel(trx);
                const sessionModel = this.Model.SessionModel(trx);
                const { data: checkAlreadyExists } = yield sessionModel.getAllSessions({
                    session_no: body.session_no,
                    institute_id,
                });
                if (checkAlreadyExists.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Session no already exists",
                    };
                }
                const session = yield sessionModel.createSession(Object.assign(Object.assign({}, body), { created_by: user_id, institute_id }));
                yield this.insertInstituteAudit(trx, {
                    details: `New session ${body.session_no} has been created`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "create",
                    created_by: user_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: session,
                };
            }));
        });
    }
    getSessions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const { limit, skip, status, session_no } = req.query;
            const model = this.Model.SessionModel();
            const data = yield model.getAllSessions({ limit, skip, status, institute_id, session_no }, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    getSingleSession(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id } = req.institute;
            const model = this.Model.SessionModel();
            const data = yield model.getAllSessions({ id, institute_id });
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
    updateSession(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const body = req.body;
                const { institute_id } = req.institute;
                const model = this.Model.SessionModel(trx);
                const check = yield model.getAllSessions({
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
                if (body.session_no) {
                    const checkAlreadyExists = yield model.getAllSessions({
                        session_no: body.session_no,
                        institute_id,
                    });
                    if (checkAlreadyExists.data.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Session no already exists",
                        };
                    }
                }
                const data = yield model.updateSession(body, id);
                yield this.insertInstituteAudit(trx, {
                    details: `Session ${check.data[0].session_no} has been updated`,
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
    deleteSession(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id } = req.institute;
                const model = this.Model.SessionModel(trx);
                const batch = this.Model.BatchModel(trx);
                const check = yield model.getAllSessions({
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
                const batchData = yield batch.getAllBatch({
                    session_id: id,
                    institute_id,
                });
                if (batchData.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Session is being used in batch",
                    };
                }
                const data = yield model.deleteSession(id);
                yield this.insertInstituteAudit(trx, {
                    details: `Session ${check.data[0].session_no} has been deleted`,
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
exports.default = InstituteSessionService;
