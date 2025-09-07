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
const database_1 = require("../../app/database");
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class BatchModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createBatch(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("batch")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    updateBatch(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("batch")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update(payload)
                .where("id", id);
        });
    }
    deleteBatch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("batch")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update({ is_deleted: true })
                .where("id", id);
        });
    }
    getAllBatch(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, isTotal = false) {
            const { limit, skip, batch_name, filter, id, institute_id, department_id, session_id, } = query;
            const filterQuery = this.db("batch as b")
                .withSchema(this.INSTITUTE_SCHEMA)
                .join("departments as dep", "dep.id", "b.department_id")
                .leftJoin("sessions as ses", "ses.id", "b.session_id")
                .leftJoin("batch_semesters as bs", function () {
                this.on("bs.batch_id", "b.id")
                    .andOn("bs.is_deleted", database_1.db.raw("FALSE"))
                    .andOn("bs.start_date", "<=", database_1.db.raw("CURRENT_DATE"))
                    .andOn("bs.end_date", ">=", database_1.db.raw("CURRENT_DATE"));
            })
                .leftJoin("semesters as sem", "sem.id", "bs.semester_id")
                .where((qb) => {
                qb.where("b.is_deleted", false);
                qb.andWhere("dep.is_deleted", false);
                if (institute_id)
                    qb.andWhere("b.institute_id", institute_id);
                if (department_id)
                    qb.andWhere("b.department_id", department_id);
                if (batch_name)
                    qb.andWhere("b.batch_name", batch_name);
                if (filter)
                    qb.andWhereILike("b.batch_name", `%${filter}%`);
                if (id)
                    qb.andWhere("b.id", id);
                if (session_id)
                    qb.andWhere("b.session_id", session_id);
            });
            const dataQuery = filterQuery
                .clone()
                .select("b.id", "b.batch_name", "dep.name as department_name", "dep.short_name as department_short_name", "dep.code as department_code", "dep.id as department_id", "ses.session_no as session_no", "ses.id as session_id", "b.start_date", "b.end_date", "b.status", "b.created_by", "cu.name as created_by_name", "b.created_at", "bs.semester_id as current_semester_id", "sem.name as current_semester_name")
                .joinRaw("LEFT JOIN dbo.users cu ON cu.id = b.created_by")
                .orderBy("b.id", "desc");
            if (limit)
                dataQuery.limit(limit);
            if (skip)
                dataQuery.offset(skip);
            const data = yield dataQuery;
            let total;
            if (isTotal) {
                const result = yield filterQuery
                    .clone()
                    .count("b.id as total")
                    .first();
                total = Number((result === null || result === void 0 ? void 0 : result.total) || "0");
            }
            return { data, total };
        });
    }
    getSingleBatch(id, institute_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("batch as b")
                .withSchema(this.INSTITUTE_SCHEMA)
                .select("b.id", "b.batch_name", "b.start_date", "b.end_date", "b.status", "b.department_id", "b.session_id", "dep.name as department_name", "dep.short_name as department_short_name", "dep.code as department_code", "ses.session_no as session_no", "b.created_by", "cu.name as created_by_name", "b.created_at")
                .leftJoin("departments as dep", "dep.id", "b.department_id")
                .leftJoin("sessions as ses", "ses.id", "b.session_id")
                .joinRaw("LEFT JOIN dbo.users cu ON cu.id = b.created_by")
                .where((qb) => {
                qb.where("b.is_deleted", false);
                qb.andWhere("b.id", id);
                qb.andWhere("b.institute_id", institute_id);
            })
                .first();
        });
    }
}
exports.default = BatchModel;
