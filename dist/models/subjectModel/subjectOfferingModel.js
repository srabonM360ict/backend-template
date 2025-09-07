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
class SubjectOfferingModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createSubjectOffering(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("subject_offerings")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    deleteSubjectOffering(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("subject_offerings")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update({ is_deleted: true })
                .where("id", id);
        });
    }
    updateSubjectOffering(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("subject_offerings")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update(payload)
                .where("id", id);
        });
    }
    getSubjectOfferings(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, isTotal = false) {
            const { limit, skip, batch_semester_id, subject_id, department_id, teacher_id, institute_id, id, } = query;
            const filterQuery = this.db("subject_offerings as so")
                .withSchema(this.INSTITUTE_SCHEMA)
                .where("so.is_deleted", false)
                .modify((qb) => {
                if (institute_id)
                    qb.andWhere("so.institute_id", institute_id);
                if (id)
                    qb.andWhere("so.id", id);
                if (batch_semester_id)
                    qb.andWhere("so.batch_semester_id", batch_semester_id);
                if (subject_id)
                    qb.andWhere("so.subject_id", subject_id);
                if (department_id)
                    qb.andWhere("so.department_id", department_id);
                if (teacher_id)
                    qb.andWhere("so.teacher_id", teacher_id);
            });
            const dataQuery = filterQuery
                .clone()
                .select("so.id", "so.institute_id", "so.batch_semester_id", "so.subject_id", "so.department_id", "so.teacher_id", "so.created_by", "so.created_at", "sub.name as subject_name", "dep.name as department_name", "u.name as teacher_name", "bs.batch_name", "sem.id as semester_id", "sem.name as semester_name")
                .leftJoin("subjects as sub", "sub.id", "so.subject_id")
                .leftJoin("departments as dep", "dep.id", "so.department_id")
                .joinRaw("LEFT JOIN dbo.users u ON u.id = so.teacher_id AND u.is_deleted = false")
                .leftJoin("batch_semesters as bs_sem", "bs_sem.id", "so.batch_semester_id")
                .leftJoin("batch as bs", "bs.id", "bs_sem.batch_id")
                .leftJoin("semesters as sem", "sem.id", "bs_sem.semester_id")
                .orderBy("so.id", "desc");
            if (limit)
                dataQuery.limit(limit);
            if (skip)
                dataQuery.offset(skip);
            const data = yield dataQuery;
            let total;
            if (isTotal) {
                const result = yield filterQuery
                    .clone()
                    .clearSelect()
                    .count("so.id as total")
                    .first();
                total = Number((result === null || result === void 0 ? void 0 : result.total) || "0");
            }
            return { data, total };
        });
    }
}
exports.default = SubjectOfferingModel;
