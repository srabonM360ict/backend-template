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
class InstituteSemesterService extends abstract_service_1.default {
    createSemester(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const { name } = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const semesterModel = this.Model.SemesterModel(trx);
                const { data: checkAlreadyExists } = yield semesterModel.getAllSemesters({
                    name,
                    institute_id,
                });
                if (checkAlreadyExists.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                const semester = yield semesterModel.createSemester({
                    name,
                    created_by: user_id,
                    institute_id,
                });
                yield this.insertInstituteAudit(trx, {
                    details: `New semester ${name} has been created`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "create",
                    created_by: user_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: semester,
                };
            }));
        });
    }
    // public async createSemesterBatch(req: Request) {
    //   const { user_id, institute_id } = req.institute;
    //   const { students, subjects, ...body } =
    //     req.body as ICreateSemesterRequestBody;
    //   return await this.db.transaction(async (trx) => {
    //     const semesterModel = this.Model.SemesterModel(trx);
    //     const departmentModel = this.Model.DepartmentModel(trx);
    //     const studentModel = this.Model.StudentModel(trx);
    //     const userModel = this.Model.UserModel(trx);
    //     const subjectModel = this.Model.SubjectModel(trx);
    //     const { data: checkAlreadyExists } = await semesterModel.getAllSemesters({
    //       name: body.name,
    //       department_id: body.department_id,
    //       institute_id,
    //     });
    //     if (checkAlreadyExists.length) {
    //       return {
    //         success: false,
    //         code: this.StatusCode.HTTP_CONFLICT,
    //         message: this.ResMsg.HTTP_CONFLICT,
    //       };
    //     }
    //     const checkDept = await departmentModel.getAllDepartments({
    //       id: body.department_id,
    //       status: true,
    //       institute_id,
    //     });
    //     if (!checkDept) {
    //       return {
    //         success: false,
    //         code: this.StatusCode.HTTP_NOT_FOUND,
    //         message: "Department not found",
    //       };
    //     }
    //     if (!checkDept.data.length) {
    //       return {
    //         success: false,
    //         code: this.StatusCode.HTTP_NOT_FOUND,
    //         message: "Department not found",
    //       };
    //     }
    //     if (body.start_date > body.end_date) {
    //       return {
    //         success: false,
    //         code: this.StatusCode.HTTP_BAD_REQUEST,
    //         message: "Start date cannot be greater than end date",
    //       };
    //     }
    //     const semester = await semesterModel.createSemester({
    //       ...body,
    //       created_by: user_id,
    //       institute_id,
    //     });
    //     if (subjects && subjects.length) {
    //       const seenSubjects = new Set<string>();
    //       const semesterSubjectPayload = [] as ICreateSemesterSubject[];
    //       for (const subject of subjects) {
    //         const key = `${subject.subject_id}-${subject.teacher_id}`;
    //         if (seenSubjects.has(key)) {
    //           throw new CustomError(
    //             `Duplicate subject assignment found for subject_id ${subject.subject_id} and teacher_id ${subject.teacher_id}`,
    //             this.StatusCode.HTTP_BAD_REQUEST
    //           );
    //         }
    //         seenSubjects.add(key);
    //         const checkSubject = await subjectModel.getAllSubjects({
    //           institute_id,
    //           id: subject.subject_id,
    //           status: true,
    //         });
    //         if (!checkSubject.data.length) {
    //           throw new CustomError(
    //             `Subject with id ${subject.subject_id} not found`,
    //             this.StatusCode.HTTP_NOT_FOUND
    //           );
    //         }
    //         //  Todo : check teacher belongs to institute
    //         semesterSubjectPayload.push({
    //           semester_id: semester[0].id,
    //           subject_id: subject.subject_id,
    //           teacher_id: subject.teacher_id,
    //           institute_id,
    //           department_id: body.department_id,
    //           created_by: user_id,
    //         });
    //       }
    //       await semesterModel.createSemesterSubject(semesterSubjectPayload);
    //     }
    //     if (students && students.length) {
    //       const seenStudents = new Set<number>();
    //       const seenStudentsRoll = new Set<string>();
    //       const studentSemesterPayload = [] as ICreateStudentSemesterPayload[];
    //       for (const student of students) {
    //         if (seenStudents.has(student.student_id)) {
    //           throw new CustomError(
    //             `Duplicate student found with id ${student.student_id}`,
    //             this.StatusCode.HTTP_BAD_REQUEST
    //           );
    //         }
    //         seenStudents.add(student.student_id);
    //         const checkStudent = await studentModel.getSingleStudent({
    //           institute_id,
    //           user_id: student.student_id,
    //         });
    //         if (!checkStudent) {
    //           throw new CustomError(
    //             `Student with id ${student.student_id} not found`,
    //             this.StatusCode.HTTP_NOT_FOUND
    //           );
    //         }
    //         if (checkStudent.department_id !== body.department_id) {
    //           throw new CustomError(
    //             "Student does not belong to this department",
    //             this.StatusCode.HTTP_BAD_REQUEST
    //           );
    //         }
    //         if (student.roll_no) {
    //           if (seenStudentsRoll.has(student.roll_no)) {
    //             throw new CustomError(
    //               `Duplicate student found with roll no ${student.roll_no}`,
    //               this.StatusCode.HTTP_BAD_REQUEST
    //             );
    //           }
    //           seenStudentsRoll.add(student.roll_no);
    //         }
    //         // Todo : check student belongs to institute
    //         studentSemesterPayload.push({
    //           student_id: student.student_id,
    //           roll_no: student.roll_no,
    //           semester_id: semester[0].id,
    //           department_id: body.department_id,
    //           institute_id,
    //           created_by: user_id,
    //         });
    //       }
    //       await semesterModel.createStudentSemester(studentSemesterPayload);
    //     }
    //     await this.insertInstituteAudit(trx, {
    //       details: `New semester ${body.name} has been created`,
    //       institute_id,
    //       endpoint: req.originalUrl,
    //       type: "create",
    //       created_by: user_id,
    //     });
    //     return {
    //       success: true,
    //       code: this.StatusCode.HTTP_SUCCESSFUL,
    //       message: this.ResMsg.HTTP_SUCCESSFUL,
    //       data: semester,
    //     };
    //   });
    // }
    getSemesters(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const { limit, skip, status, department_id, start_date, end_date, semester_status, } = req.query;
            const model = this.Model.SemesterModel();
            const data = yield model.getAllSemesters({
                limit,
                skip,
                status,
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
    updateSemester(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const body = req.body;
                const { institute_id } = req.institute;
                const model = this.Model.SemesterModel(trx);
                const check = yield model.getAllSemesters({
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
                    const checkAlreadyExists = yield model.getAllSemesters({
                        name: body.name,
                        institute_id,
                    });
                    if (checkAlreadyExists.data.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: this.ResMsg.HTTP_CONFLICT,
                        };
                    }
                }
                const data = yield model.updateSemester(body, id);
                yield this.insertInstituteAudit(trx, {
                    details: `Semester ${check.data[0].name} has been updated`,
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
    deleteSemester(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id } = req.institute;
                const model = this.Model.SemesterModel(trx);
                const batchWiseSemesterModel = this.Model.BatchWiseSemesterModel(trx);
                const check = yield model.getAllSemesters({
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
                const batchData = yield batchWiseSemesterModel.getBatchWiseSemester({
                    semester_id: id,
                    institute_id,
                });
                if (batchData.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Semester is being used in batch",
                    };
                }
                const data = yield model.deleteSemester(id);
                yield this.insertInstituteAudit(trx, {
                    details: `Semester ${check.data[0].name} has been deleted`,
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
exports.default = InstituteSemesterService;
