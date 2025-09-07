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
class StudentEnrollmentModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createEnrollment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("enrollments")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    getAllEnrollments(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, isTotal = false) {
            const { limit, skip } = query;
            const baseFilter = this.db("enrollments as e")
                .withSchema(this.INSTITUTE_SCHEMA)
                .leftJoin(this.db.raw("dbo.users as u ON u.id = e.student_id AND u.is_deleted = false"))
                .where((qb) => {
                qb.where("e.is_deleted", false);
                if (query.id)
                    qb.andWhere("e.id", query.id);
                if (query.student_id)
                    qb.andWhere("e.student_id", query.student_id);
                if (query.institute_id)
                    qb.andWhere("e.institute_id", query.institute_id);
                if (query.department_id)
                    qb.andWhere("e.department_id", query.department_id);
                if (query.batch_semester_id)
                    qb.andWhere("e.batch_semester_id", query.batch_semester_id);
                if (query.branch_id)
                    qb.andWhere("e.branch_id", query.branch_id);
                if (query.filter) {
                    qb.andWhere((qbc) => {
                        qbc
                            .andWhereILike("e.roll_no", `%${query.filter}%`)
                            .orWhere("u.name", `%${query.filter}%`);
                    });
                }
            });
            const dataQuery = baseFilter
                .clone()
                .select("e.id", "e.roll_no", "e.student_id", "e.institute_id", "e.department_id", "e.batch_semester_id", "e.branch_id", "b.name as branch_name", "sem.name as semester_name", "d.name as department_name", this.db.raw("u.name as student_name"), this.db.raw("b.name as branch_name"), this.db.raw("ARRAY_AGG(DISTINCT sub.name) as subjects"), this.db.raw(`
        CASE
          WHEN COUNT(sa.status) = 0 THEN 0
          ELSE ROUND(100.0 * SUM(CASE WHEN sa.status = 'present' THEN 1 ELSE 0 END) / COUNT(sa.status), 2)
        END as attendance_percentage
      `), "e.created_by", "e.created_at")
                .leftJoin("branches as b", "e.branch_id", "b.id")
                .leftJoin("subject_offerings as so", "e.batch_semester_id", "so.batch_semester_id")
                .joinRaw("LEFT JOIN student.student_attendance as sa ON sa.enrollment_id = e.id")
                .leftJoin("subjects as sub", "so.subject_id", "sub.id")
                .leftJoin("batch_semesters as bs", "e.batch_semester_id", "bs.id")
                .leftJoin("semesters as sem", "bs.semester_id", "sem.id")
                .leftJoin("departments as d", "e.department_id", "d.id")
                .groupBy("e.id", "u.name", "b.name", "sem.name", "d.name")
                .orderBy("e.roll_no", "desc");
            if (limit)
                dataQuery.limit(limit);
            if (skip)
                dataQuery.offset(skip);
            const data = yield dataQuery;
            let total;
            if (isTotal) {
                const result = yield baseFilter
                    .clone()
                    .countDistinct("e.id as total")
                    .first();
                total = Number((result === null || result === void 0 ? void 0 : result.total) || "0");
            }
            return { data, total };
        });
    }
    updateEnrollment(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("enrollments")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update(payload)
                .where("id", id);
        });
    }
    deleteEnrollment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("enrollments")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update({ is_deleted: true })
                .where("id", id);
        });
    }
}
exports.default = StudentEnrollmentModel;
