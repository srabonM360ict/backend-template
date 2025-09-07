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
const constants_1 = require("../../../utils/miscellaneous/constants");
class InstituteSubjectService extends abstract_service_1.default {
    createSubject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const body = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const instituteModel = this.Model.InstituteModel(trx);
                const subjectModel = this.Model.SubjectModel(trx);
                const { data: checkAlreadyExists } = yield subjectModel.getAllSubjects({
                    name: body.name,
                    institute_id,
                });
                if (checkAlreadyExists.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Subject name already exists",
                    };
                }
                const checkCode = yield subjectModel.getAllSubjects({
                    code: body.code,
                });
                if (checkCode.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Subject code already exists",
                    };
                }
                const subject = yield subjectModel.createSubject(Object.assign(Object.assign({}, body), { created_by: user_id, institute_id }));
                yield this.insertInstituteAudit(trx, {
                    details: `New subject ${body.name} has been created`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "create",
                    created_by: user_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: subject,
                };
            }));
        });
    }
    getSubjects(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const { limit, skip, status } = req.query;
            const model = this.Model.SubjectModel();
            const data = yield model.getAllSubjects({ limit, skip, status, institute_id }, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    getSingleSubject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id } = req.institute;
            const model = this.Model.SubjectModel();
            const data = yield model.getAllSubjects({ id, institute_id });
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
    updateSubject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { name, code, teacher_id } = req.body;
                const { institute_id } = req.institute;
                const model = this.Model.SubjectModel(trx);
                const check = yield model.getAllSubjects({
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
                if (teacher_id) {
                    const user = yield this.Model.InstituteModel(trx).getSingleInstituteUser({
                        user_id: teacher_id,
                        institute_id,
                        user_type: constants_1.USER_TYPE.TEACHER,
                    });
                    if (!user) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: this.ResMsg.HTTP_NOT_FOUND,
                        };
                    }
                }
                if (name) {
                    const checkAlreadyExists = yield model.getAllSubjects({
                        name,
                        institute_id,
                    });
                    if (checkAlreadyExists.data.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Subject name already exists",
                        };
                    }
                }
                if (code) {
                    const checkAlreadyExists = yield model.getAllSubjects({
                        code,
                        institute_id,
                    });
                    if (checkAlreadyExists.data.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Subject code already exists",
                        };
                    }
                }
                const data = yield model.updateSubject(req.body, id);
                yield this.insertInstituteAudit(trx, {
                    details: `Subject ${check.data[0].name} has been updated`,
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
    deleteSubject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id } = req.institute;
                const model = this.Model.SubjectModel(trx);
                const subjectOffering = this.Model.SubjectOfferingModel(trx);
                const check = yield model.getAllSubjects({
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
                const subjectOfferingCheck = yield subjectOffering.getSubjectOfferings({
                    subject_id: id,
                    institute_id,
                });
                if (subjectOfferingCheck.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Subject is being used in assign subject",
                    };
                }
                const data = yield model.deleteSubject(id);
                yield this.insertInstituteAudit(trx, {
                    details: `Subject ${check.data[0].name} has been deleted`,
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
exports.default = InstituteSubjectService;
