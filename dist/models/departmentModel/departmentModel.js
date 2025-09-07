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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class DepartmentModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createDepartment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("departments")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    updateDepartment(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("departments")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update(payload)
                .where("id", id);
        });
    }
    deleteDepartment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("departments")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update({ is_deleted: true })
                .where("id", id);
        });
    }
    getAllDepartments(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, isTotal = false) {
            const { limit, skip, name, status, id, institute_id, code, short_name } = query;
            const filterQuery = this.db("departments as dep")
                .withSchema(this.INSTITUTE_SCHEMA)
                .where((qb) => {
                qb.where("dep.is_deleted", false);
                if (institute_id) {
                    qb.andWhere("dep.institute_id", institute_id);
                }
                if (name) {
                    qb.andWhere("dep.name", name);
                }
                if (status !== undefined) {
                    qb.andWhere("dep.status", status);
                }
                if (id) {
                    qb.andWhere("dep.id", id);
                }
                if (query.department_head_id) {
                    qb.andWhere("dep.department_head_id", query.department_head_id);
                }
                if (code) {
                    qb.andWhere("dep.code", code);
                }
                if (short_name) {
                    qb.andWhere("dep.short_name", short_name);
                }
            });
            const dataQuery = filterQuery
                .clone()
                .select("dep.id", "dep.name", "dep.code", "dep.short_name", "dep.status", "dep.created_by", "cu.name as created_by_name", "dep.created_at")
                .joinRaw("LEFT JOIN dbo.users cu ON cu.id = dep.created_by")
                .orderBy("dep.id", "desc");
            if (limit) {
                dataQuery.limit(limit);
            }
            if (skip) {
                dataQuery.offset(skip);
            }
            const data = yield dataQuery;
            let total;
            if (isTotal) {
                const result = yield filterQuery
                    .clone()
                    .count("dep.id as total")
                    .first();
                total = Number((result === null || result === void 0 ? void 0 : result.total) || "0");
            }
            return { data, total };
        });
    }
    insertDepartmentSemester(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("department_semesters")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    checkDepartmentSemester(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("department_semesters")
                .withSchema(this.INSTITUTE_SCHEMA)
                .select("id")
                .where((qb) => {
                qb.andWhere("is_deleted", false);
                if (payload.department_id) {
                    qb.andWhere("department_id", payload.department_id);
                }
                if (payload.semester_id) {
                    qb.andWhere("semester_id", payload.semester_id);
                }
                if (payload.institute_id) {
                    qb.andWhere("institute_id", payload.institute_id);
                }
            });
        });
    }
    deleteDepartmentSemester(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("department_semesters")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update({ is_deleted: true })
                .where((qb) => {
                qb.andWhere("is_deleted", false);
                if (payload.id) {
                    qb.andWhere("id", payload.id);
                }
                if (payload.department_id) {
                    qb.andWhere("department_id", payload.department_id);
                }
                if (payload.institute_id) {
                    qb.andWhere("institute_id", payload.institute_id);
                }
            });
        });
    }
}
exports.default = DepartmentModel;
