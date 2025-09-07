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
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
class TeacherStudentAttendanceService extends abstract_service_1.default {
    constructor() {
        super();
    }
    getStudentAttendanceOverview(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id, is_main } = req.teacher;
            const query = req.query;
            const model = this.Model.StudentAttendanceModel();
            const data = yield model.getStudentAttendanceOverview(Object.assign(Object.assign({}, query), { teacher_id: is_main ? undefined : user_id, institute_id }), true);
            return Object.assign({ success: true, code: this.StatusCode.HTTP_OK, message: this.ResMsg.HTTP_OK }, data);
        });
    }
    getBatchAttendance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.teacher;
            const { id: batch_semester_id } = req.params;
            const { subject_offering_id, date, branch_id } = req.query;
            const model = this.Model.StudentAttendanceModel();
            const data = yield model.getAttendanceSession({
                batch_semester_id,
                subject_offering_id,
                institute_id,
                branch_id,
                date,
            });
            const attendanceList = yield model.getBatchAttendance({
                batch_semester_id,
                subject_offering_id,
                institute_id,
                branch_id,
                attendance_session_id: data === null || data === void 0 ? void 0 : data.id,
                date,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: Object.assign(Object.assign({}, data), { attendanceList }),
            };
        });
    }
    takeStudentAttendance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.teacher;
            const { subject_offering_id, date, batch_semester_id, attendances, branch_id, } = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const model = this.Model.StudentAttendanceModel(trx);
                const batchWiseSemesterModel = this.Model.BatchWiseSemesterModel(trx);
                const studentEnrollmentModel = this.Model.StudentEnrollmentModel(trx);
                const subjectOfferingModel = this.Model.SubjectOfferingModel(trx);
                const branchModel = this.Model.BranchModel(trx);
                const checkSemester = yield batchWiseSemesterModel.getBatchWiseSemester({
                    id: batch_semester_id,
                    institute_id,
                }, false);
                if (!checkSemester.data.length) {
                    throw new customError_1.default("Semester not found", this.StatusCode.HTTP_NOT_FOUND);
                }
                const today = new Date();
                if (checkSemester.data[0].end_date < today) {
                    throw new customError_1.default("Semester is over", this.StatusCode.HTTP_BAD_REQUEST);
                }
                if (checkSemester.data[0].start_date > today) {
                    throw new customError_1.default("Semester not started yet", this.StatusCode.HTTP_BAD_REQUEST);
                }
                const checkSubjectOffering = yield subjectOfferingModel.getSubjectOfferings({
                    id: subject_offering_id,
                });
                if (!checkSubjectOffering.data.length) {
                    throw new customError_1.default("Assign subject not found", this.StatusCode.HTTP_NOT_FOUND);
                }
                if (branch_id) {
                    const checkBranch = yield branchModel.getAllBranch({
                        id: branch_id,
                        institute_id,
                    });
                    if (!checkBranch.data.length) {
                        throw new customError_1.default("Branch not found", this.StatusCode.HTTP_NOT_FOUND);
                    }
                }
                const checkAlreadyTaken = yield model.getAttendanceSession({
                    batch_semester_id,
                    subject_offering_id,
                    institute_id,
                    branch_id,
                    date,
                });
                if (checkAlreadyTaken && checkAlreadyTaken.is_submitted) {
                    throw new customError_1.default("Attendance already taken for this date", this.StatusCode.HTTP_CONFLICT);
                }
                const checkTotalAttendance = yield model.getBatchAttendance({
                    batch_semester_id,
                    subject_offering_id,
                    institute_id,
                    // is_submitted: false,
                    branch_id,
                    date,
                });
                console.log({ checkTotalAttendance });
                if (!checkTotalAttendance.length) {
                    throw new customError_1.default("Attendance not found", this.StatusCode.HTTP_BAD_REQUEST);
                }
                // console.log({ checkTotalAttendance, attendances });
                // if (checkTotalAttendance.length !== attendances.length) {
                //   throw new CustomError(
                //     "Something went wrong. Please add all student attendance",
                //     this.StatusCode.HTTP_BAD_REQUEST
                //   );
                // }
                const checkAttendance = yield model.checkAttendanceSessionExists({
                    subject_offering_id,
                    institute_id,
                    date,
                    branch_id,
                });
                let session_id;
                if (!checkAttendance || !checkAttendance.id) {
                    const addSession = yield model.createAttendanceSession({
                        subject_offering_id,
                        is_submitted: true,
                        institute_id,
                        date,
                        branch_id,
                        taken_by: user_id,
                    });
                    if (!addSession.length) {
                        throw new customError_1.default("Attendance session not created", this.StatusCode.HTTP_BAD_REQUEST);
                    }
                    session_id = addSession[0].id;
                }
                else {
                    session_id = checkAttendance.id;
                }
                for (const attendance of attendances) {
                    if ((_a = checkTotalAttendance.find((x) => x.enrollment_id === attendance.enrollment_id)) === null || _a === void 0 ? void 0 : _a.student_attendance_id) {
                        continue;
                    }
                    const studentEnrollment = yield studentEnrollmentModel.getAllEnrollments({
                        id: attendance.enrollment_id,
                        institute_id,
                    }, false);
                    if (!studentEnrollment.data.length) {
                        throw new customError_1.default("Enroll student not found", this.StatusCode.HTTP_NOT_FOUND);
                    }
                    yield model.createStudentAttendance({
                        enrollment_id: attendance.enrollment_id,
                        attendance_session_id: session_id,
                        institute_id,
                        status: attendance.status,
                    });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data: {
                        attendance_session_id: session_id,
                    },
                };
            }));
        });
    }
    updateStudentAttendance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.teacher;
            const { id: student_attendance_id } = req.params;
            const { status } = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.StudentAttendanceModel(trx);
                const checkStudentAttendance = yield model.checkStudentAttendanceExists({
                    student_attendance_id,
                    institute_id,
                });
                if (!checkStudentAttendance) {
                    throw new customError_1.default("Attendance not found", this.StatusCode.HTTP_NOT_FOUND);
                }
                yield model.updateStudentAttendance({
                    status,
                }, student_attendance_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    getBranches(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.teacher;
            const { limit, skip, filter } = req.query;
            const model = this.Model.BranchModel();
            const data = yield model.getAllBranch({
                limit,
                skip,
                status: true,
                institute_id,
                filter,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: data.data,
            };
        });
    }
}
exports.default = TeacherStudentAttendanceService;
