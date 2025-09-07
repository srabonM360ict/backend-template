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
exports.InstituteBatchWiseSemesterService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
class InstituteBatchWiseSemesterService extends abstract_service_1.default {
    createBatchWiseSemester(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id } = req.institute;
                const { start_date, end_date, batch_id, semester_id, is_migration } = req.body;
                const batchWiseSemesterModel = this.Model.BatchWiseSemesterModel(trx);
                const semesterModel = this.Model.SemesterModel(trx);
                const batchModel = this.Model.BatchModel(trx);
                const studentEnrollmentModel = this.Model.StudentEnrollmentModel(trx);
                const checkBatch = yield batchModel.getSingleBatch(batch_id, institute_id);
                if (!checkBatch) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Batch not found",
                    };
                }
                if (!checkBatch.status) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Batch is not active",
                    };
                }
                const checkSemester = yield semesterModel.getAllSemesters({
                    id: semester_id,
                    status: true,
                    institute_id,
                });
                if (!checkSemester.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "Semester not found",
                    };
                }
                const checkAlreadyExists = yield batchWiseSemesterModel.getBatchWiseSemester({
                    institute_id,
                    batch_id,
                    semester_id,
                });
                if (checkAlreadyExists.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Batch Wise Semester already exists",
                    };
                }
                const checkDate = yield batchWiseSemesterModel.getBatchWiseSemester({
                    start_date,
                    end_date,
                    institute_id,
                    batch_id,
                });
                if (checkDate.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "A batch already exists within this date range for this semester",
                    };
                }
                const studentEnrollmentPayload = [];
                if (is_migration) {
                    const getPrevious = yield batchWiseSemesterModel.getBatchWiseSemester({
                        institute_id,
                        batch_id,
                        limit: 1,
                        orderTo: "desc",
                        orderBy: "bs.id",
                    });
                    if (!getPrevious.data.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "No previous semester found for migration",
                        };
                    }
                    const checkEnrollment = yield studentEnrollmentModel.getAllEnrollments({
                        batch_semester_id: getPrevious.data[0].batch_semester_id,
                        institute_id,
                    });
                    if (!checkEnrollment.data.length) {
                        throw new customError_1.default("No student found for migration on previous semester", this.StatusCode.HTTP_BAD_REQUEST);
                    }
                    for (const item of checkEnrollment.data) {
                        studentEnrollmentPayload.push({
                            student_id: item.student_id,
                            department_id: item.department_id,
                            batch_semester_id: 0,
                            branch_id: item.branch_id,
                            roll_no: item.roll_no,
                            institute_id,
                            created_by: user_id,
                        });
                    }
                }
                const batchWiseSemester = yield batchWiseSemesterModel.createBatchSemester({
                    start_date,
                    end_date,
                    batch_id,
                    semester_id,
                    institute_id,
                });
                if (is_migration) {
                    const studentEnrollmentMigration = studentEnrollmentPayload.map((item) => (Object.assign(Object.assign({}, item), { batch_semester_id: batchWiseSemester[0].id })));
                    yield studentEnrollmentModel.createEnrollment(studentEnrollmentMigration);
                }
                yield this.insertInstituteAudit(trx, {
                    details: `New Batch Wise Semester has been created ${is_migration ? "With Student Migration" : ""}`,
                    institute_id,
                    created_by: user_id,
                    endpoint: req.originalUrl,
                    type: "create",
                    payload: JSON.stringify(Object.assign(Object.assign({}, req.body), { oldData: studentEnrollmentPayload, newBatchSemesterId: batchWiseSemester[0].id })),
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: batchWiseSemester,
                };
            }));
        });
    }
    getAllBatchWiseSemester(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const _a = req.query, { batch_id } = _a, query = __rest(_a, ["batch_id"]);
            const model = this.Model.BatchWiseSemesterModel();
            const data = yield model.getBatchWiseSemester(Object.assign({ institute_id,
                batch_id }, query));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    deleteBatchWiseSemester(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id, user_id } = req.institute;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.BatchWiseSemesterModel(trx);
                const subjectOfferingModel = this.Model.SubjectOfferingModel(trx);
                const data = yield model.getBatchWiseSemester({ id, institute_id }, false);
                if (!data.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const checkSubjectOffering = yield subjectOfferingModel.getSubjectOfferings({
                    batch_semester_id: id,
                    institute_id,
                });
                if (checkSubjectOffering.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Assign subject already exists for this batchWiseSemester",
                    };
                }
                yield model.deleteBatchSemester({ id, institute_id });
                yield this.insertInstituteAudit(trx, {
                    details: `Batch Wise Semester has been deleted`,
                    institute_id,
                    created_by: user_id,
                    endpoint: req.originalUrl,
                    type: "delete",
                    payload: JSON.stringify(req.body),
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    updateBatchWiseSemester(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { institute_id, user_id } = req.institute;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { start_date, end_date } = req.body;
                const model = this.Model.BatchWiseSemesterModel(trx);
                const data = yield model.getBatchWiseSemester({ id, institute_id }, false);
                if (!data.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const checkDate = yield model.getBatchWiseSemester({
                    start_date,
                    end_date,
                    institute_id,
                    department_id: data.data[0].department_id,
                    where_not_batch_id: data.data[0].batch_id,
                });
                if (checkDate.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "A batch already exists within this date range for this semester",
                    };
                }
                yield model.updateBatchSemester({ start_date, end_date }, id);
                yield this.insertInstituteAudit(trx, {
                    details: `Batch Wise Semester has been updated`,
                    institute_id,
                    created_by: user_id,
                    endpoint: req.originalUrl,
                    type: "update",
                    payload: JSON.stringify(req.body),
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
}
exports.InstituteBatchWiseSemesterService = InstituteBatchWiseSemesterService;
