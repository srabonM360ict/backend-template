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
const constants_1 = require("../../utils/miscellaneous/constants");
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class TeacherModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createTeacher(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("teachers")
                .withSchema(this.TEACHER_SCHEMA)
                .insert(payload, "id");
        });
    }
    updateTeacher(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("teachers")
                .withSchema(this.TEACHER_SCHEMA)
                .update(payload)
                .where("user_id", id);
        });
    }
    deleteTeacher(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("teachers")
                .withSchema(this.TEACHER_SCHEMA)
                .update({ is_deleted: true })
                .where("user_id", id);
        });
    }
    getAllTeachers(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, isTotal = false) {
            const { limit, skip, institute_id, start_date, end_date, filter, department_id, status, } = query;
            let baseQuery = this.db("users as tu")
                .withSchema(this.DBO_SCHEMA)
                .select("tu.id", "tu.name", "tu.email", "tu.phone", "tu.photo", "d.name as department_name", "tu.login_id", "tu.code", "t.is_main", "t.status", "tu.created_at")
                .joinRaw("LEFT JOIN teacher.teachers t ON t.user_id = tu.id AND t.is_deleted = false")
                .joinRaw("LEFT JOIN institute.departments d ON d.id = t.department_id")
                .where("t.institute_id", institute_id)
                .andWhere("tu.is_deleted", false);
            if (start_date) {
                baseQuery = baseQuery.andWhere("t.created_at", ">=", start_date);
            }
            if (end_date) {
                baseQuery = baseQuery.andWhere("t.created_at", "<=", end_date);
            }
            if (status !== undefined) {
                baseQuery = baseQuery.andWhere("t.status", status);
            }
            if (department_id) {
                baseQuery = baseQuery.andWhere("t.department_id", department_id);
            }
            if (filter) {
                baseQuery = baseQuery.andWhere((qb) => {
                    qb.whereILike("tu.name", `%${filter}%`)
                        .orWhereILike("tu.email", `%${filter}%`)
                        .orWhereILike("tu.phone", `%${filter}%`)
                        .orWhereILike("tu.login_id", `%${filter}%`);
                });
            }
            if (typeof limit === "number")
                baseQuery = baseQuery.limit(limit);
            if (typeof skip === "number")
                baseQuery = baseQuery.offset(skip);
            baseQuery = baseQuery.orderBy("tu.created_at", "desc");
            let total;
            if (isTotal) {
                const result = yield baseQuery
                    .clone()
                    .clearSelect()
                    .clearOrder()
                    .count("tu.id as count")
                    .first();
                total = Number((result === null || result === void 0 ? void 0 : result.count) || "0");
            }
            const data = yield baseQuery;
            return { data, total };
        });
    }
    getSingleTeacher(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, institute_id, email, phone, is_main, }) {
            return yield this.db("users as tu")
                .withSchema(this.DBO_SCHEMA)
                .select("tu.id", "tu.name", "tu.email", "tu.phone", "tu.photo", "tu.login_id", "tu.password_hash", "t.status", "t.institute_id", "t.department_id", "d.name as department_name", "t.dob_date", "t.dob_no", "t.religion", "t.gender", "t.blood_group", "t.permanent_address", "t.present_address", "t.father_name", "t.mother_name", "t.emergency_phone_no", "t.created_at", "t.created_by", "t.is_main", "cb.name as created_by_name")
                .joinRaw("LEFT JOIN teacher.teachers t ON t.user_id = tu.id AND t.is_deleted = false")
                .joinRaw("LEFT JOIN institute.departments d ON d.id = t.department_id AND d.is_deleted = false")
                .joinRaw("LEFT JOIN dbo.users cb ON cb.id = t.created_by")
                .where("t.institute_id", institute_id)
                .andWhere("tu.is_deleted", false)
                .andWhere("tu.user_type", constants_1.USER_TYPE.TEACHER)
                .andWhere((qb) => {
                if (user_id) {
                    qb.where("tu.id", user_id);
                }
                if (email) {
                    qb.where("tu.email", email);
                }
                if (phone) {
                    qb.where("tu.phone", phone);
                }
                if (is_main) {
                    qb.where("t.is_main", is_main);
                }
            })
                .first();
        });
    }
}
exports.default = TeacherModel;
