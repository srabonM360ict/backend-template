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
class InstituteStudentEnrollmentService extends abstract_service_1.default {
    createStudentEnrollment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const body = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.StudentEnrollmentModel(trx);
                const departmentModel = this.Model.DepartmentModel(trx);
                const studentModel = this.Model.StudentModel(trx);
                const batchWiseSemester = this.Model.BatchWiseSemesterModel(trx);
                const check = yield model.getAllEnrollments({
                    student_id: body.student_id,
                    batch_semester_id: body.batch_semester_id,
                    institute_id,
                });
                if (check.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Student is already enrolled in this semester",
                    };
                }
                const checkBatchWise = yield batchWiseSemester.getBatchWiseSemester({
                    id: body.batch_semester_id,
                    institute_id,
                }, false);
                if (!checkBatchWise.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Batch Wise Semester not found",
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
                const student = yield studentModel.getAllStudents({
                    user_id: body.student_id,
                    institute_id,
                    limit: 1,
                    status: constants_1.USER_STATUS.ACTIVE,
                });
                if (!student.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "No active student found",
                    };
                }
                if (student.data[0].department_id !== body.department_id) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Student does not belong to this department",
                    };
                }
                const data = yield model.createEnrollment(Object.assign(Object.assign({}, body), { institute_id, created_by: user_id }));
                yield this.insertInstituteAudit(trx, {
                    details: `New enrollment created for student ${body.student_id}`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "create",
                    payload: JSON.stringify(body),
                    created_by: user_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data,
                };
            }));
        });
    }
    getStudentEnrollments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const { limit, skip, filter, batch_semester_id, department_id, student_id, } = req.query;
            const model = this.Model.StudentEnrollmentModel();
            const { data, total } = yield model.getAllEnrollments({
                institute_id,
                limit,
                skip,
                filter,
                batch_semester_id,
                department_id,
                student_id,
            }, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total,
                data,
            };
        });
    }
    getSingleStudentEnrollment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id } = req.institute;
            const model = this.Model.StudentEnrollmentModel();
            const { data } = yield model.getAllEnrollments({ id, institute_id });
            if (!data.length) {
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
                data: data[0],
            };
        });
    }
    updateStudentEnrollment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { user_id, institute_id } = req.institute;
            const body = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.StudentEnrollmentModel(trx);
                const check = yield model.getAllEnrollments({ id, institute_id });
                if (!check.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const updated = yield model.updateEnrollment(body, id);
                yield this.insertInstituteAudit(trx, {
                    details: `Enrollment ${id} updated`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "update",
                    payload: JSON.stringify(body),
                    created_by: user_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data: updated,
                };
            }));
        });
    }
    deleteStudentEnrollment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id, user_id } = req.institute;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.StudentEnrollmentModel(trx);
                const studentAttendanceModel = this.Model.StudentAttendanceModel(trx);
                const check = yield model.getAllEnrollments({ id, institute_id });
                if (!check.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const studentAttendance = yield studentAttendanceModel.checkStudentAttendanceExists({
                    enrollment_id: id,
                    institute_id,
                });
                if (studentAttendance) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "This Enrollment is being used in student attendance",
                    };
                }
                const deleted = yield model.deleteEnrollment(id);
                yield this.insertInstituteAudit(trx, {
                    details: `Enrollment ${id} deleted`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "delete",
                    created_by: user_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data: deleted,
                };
            }));
        });
    }
    getStudentAttendanceSummary(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const { limit, skip, batch_semester_id, department_id, start_date, end_date, } = req.query;
            const model = this.Model.StudentAttendanceModel();
            const { data, total } = yield model.getAttendanceSummary({
                institute_id,
                batch_semester_id,
                from_date: start_date,
                to_date: end_date,
                limit,
                department_id,
                skip,
            }, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total,
                data,
            };
        });
    }
}
exports.default = InstituteStudentEnrollmentService;
