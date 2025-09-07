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
class InstituteStudentService extends abstract_service_1.default {
    constructor() {
        super(...arguments);
        this.createStudent = (req) => __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const { name, email, phone, password, department_id, batch_id, branch_id, roll_no, } = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const userModel = this.Model.UserModel(trx);
                const studentModel = this.Model.StudentModel(trx);
                const studentAttendanceModel = this.Model.StudentAttendanceModel(trx);
                const departmentModel = this.Model.DepartmentModel(trx);
                const batchWiseSemesterModel = this.Model.BatchWiseSemesterModel(trx);
                const batchModel = this.Model.BatchModel(trx);
                const studentEnrollmentModel = this.Model.StudentEnrollmentModel(trx);
                const branchModel = this.Model.BranchModel(trx);
                const { institute_name, institution_code } = yield this.Model.InstituteModel(trx).getSingleInstitute({
                    id: institute_id,
                });
                if (!institute_name || !institution_code) {
                    throw new customError_1.default("Institute not found", this.StatusCode.HTTP_NOT_FOUND);
                }
                const checkBatch = yield batchModel.getAllBatch({
                    id: batch_id,
                    institute_id,
                });
                if (!checkBatch || !checkBatch.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Batch not found",
                    };
                }
                if (email) {
                    const existingStudent = yield studentModel.getSingleStudent({
                        institute_id,
                        email,
                    });
                    if (existingStudent) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Email already exists",
                        };
                    }
                }
                if (phone) {
                    const existingPhone = yield studentModel.getSingleStudent({
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
                }
                const checkBranch = yield branchModel.getAllBranch({
                    id: branch_id,
                    institute_id,
                });
                if (!checkBranch || !checkBranch.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Branch not found",
                    };
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
                const checkBatchSemester = yield batchWiseSemesterModel.getBatchWiseSemester({
                    institute_id,
                    batch_id,
                });
                if (!checkBatchSemester || !checkBatchSemester.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Batch Wise Semester not found",
                    };
                }
                const checkRollNo = yield studentAttendanceModel.getStudentAttendanceOverview({
                    institute_id,
                    batch_id,
                    roll_no,
                });
                if (checkRollNo.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Roll No already exists",
                    };
                }
                const session = checkBatch.data[0].session_no;
                const [start, end] = session.split("-");
                const sessionYear = start.slice(-2) + end.slice(-2);
                let code = yield lib_1.default.generateLoginCodeForStudent({
                    institute_code: institution_code,
                    db: this.db,
                    userType: constants_1.USER_TYPE.STUDENT,
                    schema: "dbo",
                    dpt_code: checkDept.data[0].code,
                    sessionYear,
                });
                while (yield userModel.checkUser({ code, type: constants_1.USER_TYPE.STUDENT })) {
                    code = yield lib_1.default.generateLoginCodeForStudent({
                        institute_code: institution_code,
                        db: this.db,
                        userType: constants_1.USER_TYPE.STUDENT,
                        schema: "dbo",
                        dpt_code: checkDept.data[0].code,
                        sessionYear,
                    });
                }
                const login_id = code.split(".").join("");
                const password_hash = yield lib_1.default.hashValue(password);
                const user = yield userModel.createUser({
                    user_type: constants_1.USER_TYPE.STUDENT,
                    email,
                    name,
                    password_hash,
                    phone,
                    login_id,
                    code,
                });
                yield studentModel.createStudent({
                    status: constants_1.USER_STATUS.ACTIVE,
                    department_id,
                    user_id: user[0].id,
                    created_by: user_id,
                    institute_id,
                });
                yield studentEnrollmentModel.createEnrollment({
                    student_id: user[0].id,
                    department_id,
                    batch_semester_id: checkBatchSemester.data[0].batch_semester_id,
                    branch_id,
                    roll_no,
                    created_by: user_id,
                    institute_id,
                });
                yield this.insertInstituteAudit(trx, {
                    created_by: user_id,
                    details: `Student ${name}, ID:${login_id} has been created`,
                    endpoint: req.originalUrl,
                    institute_id,
                    type: "create",
                    payload: JSON.stringify(req.body),
                });
                if (email) {
                    yield lib_1.default.sendEmailDefault({
                        email,
                        emailBody: (0, welcomeEmailTemplate_1.welcomeCompletedTemplate)(name, {
                            login_id: login_id || email,
                            password,
                        }, constants_1.USER_TYPE.MANAGEMENT),
                        emailSub: `Welcome To ${institute_name} - BPI SAAS Software.`,
                    });
                }
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
        this.getAllStudent = (req) => __awaiter(this, void 0, void 0, function* () {
            const { filter, start_date, end_date, department_id, semester_id, status, limit, skip, } = req.query;
            const { institute_id } = req.institute;
            const model = this.Model.StudentModel();
            const data = yield model.getAllStudents({
                filter,
                start_date,
                end_date,
                institute_id,
                status,
                semester_id,
                department_id,
                limit,
                skip,
            }, true);
            return Object.assign({ success: true, message: this.ResMsg.HTTP_OK, code: this.StatusCode.HTTP_OK }, data);
        });
        this.getSingleStudent = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id } = req.institute;
            const model = this.Model.StudentModel();
            const enrollmentModel = this.Model.StudentEnrollmentModel();
            const data = yield model.getSingleStudent({
                user_id: id,
                institute_id,
            });
            if (!data) {
                throw new customError_1.default(this.ResMsg.HTTP_NOT_FOUND, this.StatusCode.HTTP_NOT_FOUND);
            }
            const { data: enrollments } = yield enrollmentModel.getAllEnrollments({
                student_id: id,
                institute_id,
                department_id: data.department_id,
            });
            const { password_hash } = data, rest = __rest(data, ["password_hash"]);
            return {
                success: true,
                message: this.ResMsg.HTTP_OK,
                code: this.StatusCode.HTTP_OK,
                data: Object.assign(Object.assign({}, rest), { enrollments }),
            };
        });
        this.deleteStudent = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id: created_by } = req.institute;
                const { id } = req.params;
                const userModel = this.Model.UserModel(trx);
                const studentModel = this.Model.StudentModel(trx);
                const studentEnrollmentModel = this.Model.StudentEnrollmentModel(trx);
                const check = yield userModel.checkUser({
                    type: constants_1.USER_TYPE.STUDENT,
                    id,
                });
                if (!check) {
                    throw new customError_1.default(this.ResMsg.HTTP_NOT_FOUND, this.StatusCode.HTTP_NOT_FOUND);
                }
                const checkStudent = yield studentModel.getSingleStudent({
                    user_id: id,
                    institute_id,
                });
                if (!check) {
                    throw new customError_1.default(this.ResMsg.HTTP_NOT_FOUND, this.StatusCode.HTTP_NOT_FOUND);
                }
                const { data: enrollments } = yield studentEnrollmentModel.getAllEnrollments({
                    student_id: id,
                    institute_id,
                    department_id: checkStudent.department_id,
                });
                if (enrollments.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Student is being used in enrollment",
                    };
                }
                yield userModel.deleteUser(id);
                yield studentModel.deleteStudent(id);
                yield this.insertInstituteAudit(trx, {
                    details: `Student ${check.name}, ID:${check.login_id} has been deleted`,
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
        this.updateStudent = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id: created_by } = req.institute;
                const { id } = req.params;
                const _a = req.body, { password, status } = _a, body = __rest(_a, ["password", "status"]);
                const userModel = this.Model.UserModel(trx);
                const studentModel = this.Model.StudentModel(trx);
                const check = yield userModel.checkUser({
                    type: constants_1.USER_TYPE.STUDENT,
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
                        type: constants_1.USER_TYPE.STUDENT,
                    });
                    if (checkEmail) {
                        throw new customError_1.default(this.ResMsg.EMAIL_ALREADY_EXISTS, this.StatusCode.HTTP_CONFLICT);
                    }
                }
                if (body.phone) {
                    const checkPhone = yield userModel.checkUser({
                        phone: body.phone,
                        type: constants_1.USER_TYPE.STUDENT,
                    });
                    if (checkPhone) {
                        throw new customError_1.default(this.ResMsg.phone_ALREADY_EXISTS, this.StatusCode.HTTP_CONFLICT);
                    }
                }
                if (status) {
                    yield studentModel.updateStudent({ status }, id);
                }
                if (Object.keys(body).length > 0) {
                    yield userModel.updateProfile(body, id);
                }
                yield this.insertInstituteAudit(trx, {
                    details: `Student ${check.name}, ID:${check.code} has been updated`,
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
exports.default = InstituteStudentService;
