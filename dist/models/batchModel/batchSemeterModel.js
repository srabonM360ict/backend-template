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
class BatchWiseSemesterModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    getBatchWiseSemester(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, needTotal = true) {
            var _a;
            const now = new Date();
            const data = yield this.db("batch_semesters as bs")
                .withSchema(this.INSTITUTE_SCHEMA)
                .select("bs.id as batch_semester_id", "sem.id as semester_id", "sem.name as semester_name", "bat.id as batch_id", "bat.department_id", "dep.name as department_name", "bat.batch_name", "bs.start_date", "bs.end_date", this.db.raw(`
          CASE
          WHEN bs.start_date <= ? AND bs.end_date >= ? THEN 'ongoing'
          WHEN bs.start_date > ? THEN 'upcoming'
          ELSE 'completed'
          END as status
          `, [now, now, now]), "bs.created_at")
                .join("semesters as sem", "sem.id", "bs.semester_id")
                .join("batch as bat", "bat.id", "bs.batch_id")
                .join("departments as dep", "dep.id", "bat.department_id")
                .where("bs.is_deleted", false)
                .andWhere("bs.institute_id", query.institute_id)
                .modify((qb) => {
                if (query.batch_id)
                    qb.andWhere("bs.batch_id", query.batch_id);
                if (query.semester_id)
                    qb.andWhere("bs.semester_id", query.semester_id);
                if (query.status) {
                    if (query.status === constants_1.SEMESTER_STATUS.ONGOING) {
                        qb.andWhere("bs.start_date", "<=", now).andWhere("bs.end_date", ">=", now);
                    }
                    else if (query.status === constants_1.SEMESTER_STATUS.UPCOMING) {
                        qb.andWhere("bs.start_date", ">", now);
                    }
                    else if (query.status === constants_1.SEMESTER_STATUS.COMPLETED) {
                        qb.andWhere("bs.end_date", "<", now);
                    }
                }
                if (query.id)
                    qb.andWhere("bs.id", query.id);
                if (query.start_date && query.end_date) {
                    qb.andWhere("bs.start_date", "<=", query.end_date).andWhere("bs.end_date", ">=", query.start_date);
                }
                if (query.where_not_batch_id)
                    qb.andWhere("bs.batch_id", "!=", query.where_not_batch_id);
                if (query.department_id)
                    qb.andWhere("bat.department_id", query.department_id);
                if (query.filter) {
                    qb.andWhere("sem.name", "like", `%${query.filter}%`);
                }
            })
                .orderBy(query.orderBy || "bs.created_at", query.orderTo || "asc")
                .limit(query.limit || 100)
                .offset(query.skip || 0);
            let total = [];
            if (needTotal) {
                total = yield this.db("batch_semesters as bs")
                    .withSchema(this.INSTITUTE_SCHEMA)
                    .count("bs.id as total")
                    .join("semesters as sem", "sem.id", "bs.semester_id")
                    .join("batch as bat", "bat.id", "bs.batch_id")
                    .where("bs.is_deleted", false)
                    .andWhere("bs.institute_id", query.institute_id)
                    .modify((qb) => {
                    if (query.batch_id)
                        qb.andWhere("bs.batch_id", query.batch_id);
                    if (query.semester_id)
                        qb.andWhere("bs.semester_id", query.semester_id);
                    if (query.status) {
                        if (query.status === constants_1.SEMESTER_STATUS.ONGOING) {
                            qb.andWhere("bs.start_date", "<=", now).andWhere("bs.end_date", ">=", now);
                        }
                        else if (query.status === constants_1.SEMESTER_STATUS.UPCOMING) {
                            qb.andWhere("bs.start_date", ">", now);
                        }
                        else if (query.status === constants_1.SEMESTER_STATUS.COMPLETED) {
                            qb.andWhere("bs.end_date", "<", now);
                        }
                    }
                    if (query.id)
                        qb.andWhere("bs.id", query.id);
                    if (query.start_date && query.end_date) {
                        qb.andWhereBetween("bs.start_date", [
                            query.start_date,
                            query.end_date,
                        ]).orWhereBetween("bs.end_date", [
                            query.start_date,
                            query.end_date,
                        ]);
                    }
                    if (query.where_not_batch_id)
                        qb.andWhere("bs.batch_id", "!=", query.where_not_batch_id);
                    if (query.department_id)
                        qb.andWhere("bat.department_id", query.department_id);
                    if (query.filter) {
                        qb.andWhereLike("sem.name", `%${query.filter}%`);
                    }
                });
            }
            return { data, total: (_a = total === null || total === void 0 ? void 0 : total[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
    createBatchSemester(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("batch_semesters")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    deleteBatchSemester(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("batch_semesters")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update({ is_deleted: true })
                .where("id", payload.id)
                .andWhere("institute_id", payload.institute_id);
        });
    }
    updateBatchSemester(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("batch_semesters")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update(payload)
                .where("id", id);
        });
    }
}
exports.default = BatchWiseSemesterModel;
