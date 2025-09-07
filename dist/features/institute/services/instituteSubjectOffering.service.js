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
const constants_1 = require("../../../utils/miscellaneous/constants");
class InstituteSubjectOfferingService extends abstract_service_1.default {
    createSubjectOffering(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const body = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.SubjectOfferingModel(trx);
                const batchWiseSemesterModel = this.Model.BatchWiseSemesterModel(trx);
                const subjectModel = this.Model.SubjectModel(trx);
                const teacherModel = this.Model.TeacherModel(trx);
                // const batchModel = this.Model.BatchModel(trx);
                const batchWiseSemester = yield batchWiseSemesterModel.getBatchWiseSemester({
                    id: body.batch_semester_id,
                    institute_id,
                }, false);
                if (!batchWiseSemester.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Batch-wise semester not found",
                    };
                }
                if (batchWiseSemester.data[0].department_id !== body.department_id) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Department not match with batch-wise semester",
                    };
                }
                const baseWiseSubjectPayload = [];
                const seenSubject = new Set();
                for (const subjectTeacher of body.subject_teachers) {
                    const subject = yield subjectModel.getAllSubjects({
                        id: subjectTeacher.subject_id,
                        institute_id,
                    });
                    if (!subject.data.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: "Subject not found",
                        };
                    }
                    if (seenSubject.has(subjectTeacher.subject_id)) {
                        throw new customError_1.default(`Subject "${subject.data[0].name}" has duplicate entry!`, this.StatusCode.HTTP_CONFLICT);
                    }
                    seenSubject.add(subjectTeacher.subject_id);
                    const existing = yield model.getSubjectOfferings({
                        batch_semester_id: body.batch_semester_id,
                        subject_id: subjectTeacher.subject_id,
                        department_id: body.department_id,
                        // teacher_id: body.teacher_id,
                        institute_id,
                    });
                    if (existing.data.length) {
                        throw new customError_1.default("This assign subject already exists", this.StatusCode.HTTP_CONFLICT);
                    }
                    const teacher = yield teacherModel.getSingleTeacher({
                        user_id: subjectTeacher.teacher_id,
                        institute_id,
                    });
                    if (!teacher) {
                        throw new customError_1.default("Teacher not found", this.StatusCode.HTTP_NOT_FOUND);
                    }
                    if (teacher.status !== constants_1.USER_STATUS.ACTIVE) {
                        throw new customError_1.default("Teacher account is not active", this.StatusCode.HTTP_CONFLICT);
                    }
                    // const checkBatch = await batchModel.getSingleBatch(
                    //   batchWiseSemester.data[0].batch_id,
                    //   institute_id
                    // );
                    baseWiseSubjectPayload.push({
                        batch_semester_id: body.batch_semester_id,
                        subject_id: subjectTeacher.subject_id,
                        department_id: body.department_id,
                        teacher_id: subjectTeacher.teacher_id,
                        created_by: user_id,
                        institute_id,
                    });
                }
                yield model.createSubjectOffering(baseWiseSubjectPayload);
                yield this.insertInstituteAudit(trx, {
                    details: `Assign subject for ${batchWiseSemester.data[0].batch_name} has been created`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "create",
                    created_by: user_id,
                    payload: req.body,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    updateSubjectOffering(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { user_id, institute_id } = req.institute;
            const body = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.SubjectOfferingModel(trx);
                const teacherModel = this.Model.TeacherModel(trx);
                const check = yield model.getSubjectOfferings({
                    institute_id,
                    id: id,
                });
                if (!check.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Assign subject not found",
                    };
                }
                if (body.teacher_id) {
                    const checkTeacher = yield teacherModel.getSingleTeacher({
                        institute_id,
                        user_id: body.teacher_id,
                    });
                    if (!checkTeacher) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: "Teacher not found",
                        };
                    }
                    if (checkTeacher.status !== constants_1.USER_STATUS.ACTIVE) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Teacher account is not active",
                        };
                    }
                }
                const result = yield model.updateSubjectOffering(body, id);
                yield this.insertInstituteAudit(trx, {
                    details: `Assign subject ID ${id} has been updated`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "update",
                    created_by: user_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data: result,
                };
            }));
        });
    }
    getSubjectOfferings(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const { limit, skip, batch_semester_id, subject_id, department_id, teacher_id, } = req.query;
            const model = this.Model.SubjectOfferingModel();
            const data = yield model.getSubjectOfferings({
                limit,
                skip,
                batch_semester_id,
                subject_id,
                department_id,
                teacher_id,
                institute_id,
            }, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    deleteSubjectOffering(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { user_id, institute_id } = req.institute;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.SubjectOfferingModel(trx);
                const studentAttendanceModel = this.Model.StudentAttendanceModel(trx);
                const check = yield model.getSubjectOfferings({
                    institute_id,
                    id,
                });
                if (!check.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Assign subject not found",
                    };
                }
                const checkStudentAttendance = yield studentAttendanceModel.checkAttendanceSessionExists({
                    institute_id,
                    subject_offering_id: id,
                });
                if (checkStudentAttendance) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Assign subject is being used in student attendance session",
                    };
                }
                const result = yield model.deleteSubjectOffering(id);
                yield this.insertInstituteAudit(trx, {
                    details: `Assign subject ID ${id} has been deleted`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "delete",
                    created_by: user_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data: result,
                };
            }));
        });
    }
}
exports.default = InstituteSubjectOfferingService;
