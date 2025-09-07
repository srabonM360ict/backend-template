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
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
const constants_1 = require("../../../utils/miscellaneous/constants");
const welcomeEmailTemplate_1 = require("../../../utils/templates/welcomeEmailTemplate");
class InstituteTeacherService extends abstract_service_1.default {
    constructor() {
        super(...arguments);
        this.createTeacher = (req) => __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const { name, email, phone, teacher_id, password, department_id, is_main } = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const userModel = this.Model.UserModel(trx);
                const teacherModel = this.Model.TeacherModel(trx);
                const departmentModel = this.Model.DepartmentModel(trx);
                const { institute_name, institution_code } = yield this.Model.InstituteModel(trx).getSingleInstitute({
                    id: institute_id,
                });
                if (!institute_name || !institution_code) {
                    throw new customError_1.default("Institute not found", this.StatusCode.HTTP_NOT_FOUND);
                }
                const existingTeacher = yield teacherModel.getSingleTeacher({
                    institute_id,
                    email,
                });
                if (existingTeacher) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Email already exists",
                    };
                }
                const existingPhone = yield teacherModel.getSingleTeacher({
                    institute_id,
                    phone,
                });
                if (existingPhone) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Phone number already exists",
                    };
                }
                if (is_main) {
                    const mainTeacher = yield teacherModel.getSingleTeacher({
                        institute_id,
                        is_main: true,
                    });
                    if (mainTeacher) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Main teacher already exists",
                        };
                    }
                }
                const checkDept = yield departmentModel.getAllDepartments({
                    id: department_id,
                    institute_id,
                });
                if (!checkDept || !checkDept.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Department not found",
                    };
                }
                const code = `${institution_code}.${teacher_id}`;
                const login_id = code.split(".").join("");
                const checkLoginId = yield userModel.checkUser({
                    code,
                    type: constants_1.USER_TYPE.TEACHER,
                });
                if (checkLoginId) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Teacher code already exists",
                    };
                }
                const password_hash = yield lib_1.default.hashValue(password);
                const user = yield userModel.createUser({
                    user_type: constants_1.USER_TYPE.TEACHER,
                    code,
                    email,
                    name,
                    password_hash,
                    phone,
                    login_id,
                });
                const teacher = yield teacherModel.createTeacher({
                    status: constants_1.USER_STATUS.ACTIVE,
                    department_id,
                    user_id: user[0].id,
                    created_by: user_id,
                    institute_id,
                    is_main: is_main || false,
                });
                yield this.insertInstituteAudit(trx, {
                    created_by: user_id,
                    details: `Teacher ${name}, ID:${login_id} has been created`,
                    endpoint: req.originalUrl,
                    institute_id,
                    type: "create",
                    payload: JSON.stringify(req.body),
                });
                yield lib_1.default.sendEmailDefault({
                    email,
                    emailBody: (0, welcomeEmailTemplate_1.welcomeCompletedTemplate)(name, {
                        login_id: login_id || email,
                        password,
                    }, constants_1.USER_TYPE.MANAGEMENT),
                    emailSub: `Welcome To ${institute_name} - BPI SAAS Software.`,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: {
                        id: user[0].id,
                    },
                };
            }));
        });
        this.getAllTeacher = (req) => __awaiter(this, void 0, void 0, function* () {
            const { filter, start_date, end_date, department_id, status, limit, skip } = req.query;
            const { institute_id } = req.institute;
            const model = this.Model.TeacherModel();
            const data = yield model.getAllTeachers({
                filter,
                start_date,
                end_date,
                institute_id,
                status,
                department_id,
                limit,
                skip,
            }, true);
            return Object.assign({ success: true, message: this.ResMsg.HTTP_OK, code: this.StatusCode.HTTP_OK }, data);
        });
        this.getSingleTeacher = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id } = req.institute;
            const model = this.Model.TeacherModel();
            const data = yield model.getSingleTeacher({
                user_id: id,
                institute_id,
            });
            if (!data) {
                throw new customError_1.default(this.ResMsg.HTTP_NOT_FOUND, this.StatusCode.HTTP_NOT_FOUND);
            }
            const { password_hash } = data, rest = __rest(data, ["password_hash"]);
            return {
                success: true,
                message: this.ResMsg.HTTP_OK,
                code: this.StatusCode.HTTP_OK,
                data: rest,
            };
        });
        this.deleteTeacher = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id: created_by } = req.institute;
                const { id } = req.params;
                const userModel = this.Model.UserModel(trx);
                const teacherModel = this.Model.TeacherModel(trx);
                const subjectOfferingModel = this.Model.SubjectOfferingModel(trx);
                const check = yield userModel.checkUser({
                    type: constants_1.USER_TYPE.TEACHER,
                    id,
                });
                if (!check) {
                    throw new customError_1.default(this.ResMsg.HTTP_NOT_FOUND, this.StatusCode.HTTP_NOT_FOUND);
                }
                const { data: subjectOffering } = yield subjectOfferingModel.getSubjectOfferings({
                    teacher_id: id,
                }, false);
                if (subjectOffering.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Teacher is being used in assign subject",
                    };
                }
                yield userModel.deleteUser(id);
                yield teacherModel.deleteTeacher(id);
                yield this.insertInstituteAudit(trx, {
                    details: `Teacher ${check.name}, ID:${check.login_id} has been deleted`,
                    endpoint: req.originalUrl,
                    institute_id,
                    type: "delete",
                    created_by,
                });
                return {
                    success: true,
                    message: this.ResMsg.HTTP_OK,
                    code: this.StatusCode.HTTP_OK,
                };
            }));
        });
        this.updateTeacher = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id: created_by } = req.institute;
                const { id } = req.params;
                const _a = req.body, { password } = _a, body = __rest(_a, ["password"]);
                const userModel = this.Model.UserModel(trx);
                // const teacherModel = this.Model.TeacherModel(trx);
                const check = yield userModel.checkUser({
                    type: constants_1.USER_TYPE.TEACHER,
                    id,
                });
                if (!check) {
                    throw new customError_1.default(this.ResMsg.HTTP_NOT_FOUND, this.StatusCode.HTTP_NOT_FOUND);
                }
                if (password) {
                    body.password_hash = yield lib_1.default.hashValue(password);
                }
                if (body.email) {
                    const checkEmail = yield userModel.checkUser({
                        email: body.email,
                        type: constants_1.USER_TYPE.TEACHER,
                    });
                    if (checkEmail) {
                        throw new customError_1.default(this.ResMsg.EMAIL_ALREADY_EXISTS, this.StatusCode.HTTP_CONFLICT);
                    }
                }
                if (body.phone) {
                    const checkPhone = yield userModel.checkUser({
                        phone: body.phone,
                        type: constants_1.USER_TYPE.TEACHER,
                    });
                    if (checkPhone) {
                        throw new customError_1.default(this.ResMsg.phone_ALREADY_EXISTS, this.StatusCode.HTTP_CONFLICT);
                    }
                }
                yield userModel.updateProfile(body, id);
                yield this.insertInstituteAudit(trx, {
                    details: `Teacher ${check.name}, ID:${check.code} has been updated`,
                    endpoint: req.originalUrl,
                    institute_id,
                    type: "update",
                    created_by,
                });
                return {
                    success: true,
                    message: this.ResMsg.HTTP_OK,
                    code: this.StatusCode.HTTP_OK,
                };
            }));
        });
    }
}
exports.default = InstituteTeacherService;
