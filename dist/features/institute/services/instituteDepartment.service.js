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
const constants_1 = require("../../../utils/miscellaneous/constants");
class InstituteDepartmentService extends abstract_service_1.default {
    createDepartment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const body = __rest(req.body, []);
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const instituteModel = this.Model.InstituteModel(trx);
                const departmentModel = this.Model.DepartmentModel(trx);
                const semesterModel = this.Model.SemesterModel(trx);
                const { data: checkAlreadyExists } = yield departmentModel.getAllDepartments({
                    name: body.name,
                    institute_id,
                });
                if (checkAlreadyExists.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Department name already exists",
                    };
                }
                const { data: checkAlreadyExistsCode } = yield departmentModel.getAllDepartments({
                    code: body.code,
                    institute_id,
                });
                if (checkAlreadyExistsCode.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Department code already exists",
                    };
                }
                const { data: checkAlreadyExistsShortName } = yield departmentModel.getAllDepartments({
                    short_name: body.short_name,
                    institute_id,
                });
                if (checkAlreadyExistsShortName.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Department short name already exists",
                    };
                }
                if (body.department_head_id) {
                    // TODO: check if user exists and is a member of the institute;
                    const user = yield instituteModel.getSingleInstituteUser({
                        user_id: body.department_head_id,
                        institute_id,
                        user_type: constants_1.USER_TYPE.DEPARTMENT_HEAD,
                    });
                    if (!user) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: this.ResMsg.HTTP_NOT_FOUND,
                        };
                    }
                    const checkAlreadyAnotherDeptHead = yield departmentModel.getAllDepartments({
                        department_head_id: body.department_head_id,
                        institute_id,
                    });
                    if (checkAlreadyAnotherDeptHead) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "This Teacher is already assigned to another department",
                        };
                    }
                }
                const department = yield departmentModel.createDepartment(Object.assign(Object.assign({}, body), { created_by: user_id, institute_id }));
                // if (semesters.length) {
                //   const semesterDepartment = [] as ICreateDepartmentSemester[];
                //   const seenDept = new Set() as Set<number>;
                //   for (const semester of semesters) {
                //     if (seenDept.has(semester)) {
                //       throw new CustomError(
                //         "Duplicate semesters",
                //         this.StatusCode.HTTP_BAD_REQUEST
                //       );
                //     }
                //     seenDept.add(semester);
                //     const semesters = await semesterModel.getAllSemesters({
                //       institute_id,
                //       id: semester,
                //       status: true,
                //     });
                //     if (!semesters.data.length) {
                //       throw new CustomError(
                //         "Semester does not exist",
                //         this.StatusCode.HTTP_BAD_REQUEST
                //       );
                //     }
                //     semesterDepartment.push({
                //       department_id: department[0].id,
                //       semester_id: semester,
                //       institute_id,
                //       created_by: user_id,
                //     });
                //   }
                //   if (semesterDepartment) {
                //     await departmentModel.insertDepartmentSemester(semesterDepartment);
                //   }
                // }
                yield this.insertInstituteAudit(trx, {
                    details: `New department ${body.name} has been created`,
                    institute_id,
                    endpoint: req.originalUrl,
                    type: "create",
                    created_by: user_id,
                    payload: JSON.stringify(req.body),
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: department,
                };
            }));
        });
    }
    getDepartments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institute_id } = req.institute;
            const { limit, skip, status } = req.query;
            const model = this.Model.DepartmentModel();
            const data = yield model.getAllDepartments({ limit, skip, status, institute_id }, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    // public async getSingleDepartment(req: Request) {
    //   const { id } = req.params as unknown as { id: number };
    //   const { institute_id } = req.institute;
    //   const model = this.Model.DepartmentModel();
    //   const semesterModel = this.Model.SemesterModel();
    //   const data = await model.getAllDepartments({ id, institute_id });
    //   if (!data.data.length) {
    //     return {
    //       success: false,
    //       code: this.StatusCode.HTTP_NOT_FOUND,
    //       message: this.ResMsg.HTTP_NOT_FOUND,
    //     };
    //   }
    //   const semesters = await semesterModel.getAllDepartmentSemester({
    //     department_id: id,
    //     institute_id,
    //   });
    //   return {
    //     success: true,
    //     code: this.StatusCode.HTTP_OK,
    //     data: { ...data.data[0], semesters },
    //   };
    // }
    updateDepartment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { name, status, department_head_id } = req.body;
                const { institute_id } = req.institute;
                const model = this.Model.DepartmentModel(trx);
                const departmentModel = this.Model.DepartmentModel(trx);
                const check = yield model.getAllDepartments({
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
                if (department_head_id) {
                    const user = yield this.Model.InstituteModel(trx).getSingleInstituteUser({
                        user_id: department_head_id,
                        institute_id,
                        user_type: constants_1.USER_TYPE.DEPARTMENT_HEAD,
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
                    const checkAlreadyExists = yield model.getAllDepartments({
                        name,
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
                // if (add_semesters?.length) {
                //   const addSemesterPayload = [] as ICreateDepartmentSemester[];
                //   const seen = new Set() as Set<number>;
                //   for (const semester of add_semesters) {
                //     if (seen.has(semester)) {
                //       throw new CustomError(
                //         "Duplicate Semester found",
                //         this.StatusCode.HTTP_BAD_REQUEST
                //       );
                //     }
                //     seen.add(semester);
                //     const semesters = await this.Model.SemesterModel(trx).getAllSemesters(
                //       {
                //         institute_id,
                //         id: semester,
                //         status: true,
                //       }
                //     );
                //     if (!semesters.data.length) {
                //       throw new CustomError(
                //         "Semester not found",
                //         this.StatusCode.HTTP_NOT_FOUND
                //       );
                //     }
                //     const check = await departmentModel.checkDepartmentSemester({
                //       department_id: id,
                //       semester_id: semester,
                //       institute_id,
                //     });
                //     if (check.length) {
                //       throw new CustomError(
                //         "Semester already exists in the department",
                //         this.StatusCode.HTTP_CONFLICT
                //       );
                //     }
                //     addSemesterPayload.push({
                //       department_id: id,
                //       semester_id: semester,
                //       institute_id,
                //       created_by: req.institute.user_id,
                //     });
                //   }
                //   if (addSemesterPayload.length) {
                //     await departmentModel.insertDepartmentSemester(addSemesterPayload);
                //   }
                // }
                // if (remove_semesters?.length) {
                //   for (const semester of remove_semesters) {
                //     const check = await departmentModel.checkDepartmentSemester({
                //       department_id: id,
                //       semester_id: semester,
                //       institute_id,
                //     });
                //     if (!check.length) {
                //       throw new CustomError(
                //         "Semester not found",
                //         this.StatusCode.HTTP_NOT_FOUND
                //       );
                //     }
                //     await departmentModel.deleteDepartmentSemester({
                //       id: check[0].id,
                //       department_id: id,
                //       institute_id,
                //     });
                //   }
                // }
                const data = yield model.updateDepartment({
                    name,
                    department_head_id,
                    institute_id,
                }, id);
                yield this.insertInstituteAudit(trx, {
                    details: `Department ${check.data[0].name} has been updated`,
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
    deleteDepartment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { institute_id, user_id } = req.institute;
                const model = this.Model.DepartmentModel(trx);
                const batch = this.Model.BatchModel(trx);
                const check = yield model.getAllDepartments({
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
                    department_id: id,
                    institute_id,
                });
                if (batchData.data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Department is being used in batch",
                    };
                }
                const data = yield model.deleteDepartment(id);
                // await model.deleteDepartmentSemester({
                //   department_id: id,
                //   institute_id,
                // });
                yield this.insertInstituteAudit(trx, {
                    details: `Department ${check.data[0].name} has been deleted`,
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
exports.default = InstituteDepartmentService;
