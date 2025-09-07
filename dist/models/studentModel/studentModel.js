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
class StudentModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createStudent(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("students")
                .withSchema(this.STUDENT_SCHEMA)
                .insert(payload, "id");
        });
    }
    updateStudent(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("students")
                .withSchema(this.STUDENT_SCHEMA)
                .update(payload)
                .where("user_id", id);
        });
    }
    deleteStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("students")
                .withSchema(this.STUDENT_SCHEMA)
                .update({ is_deleted: true })
                .where("user_id", id);
        });
    }
    getAllStudents(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, isTotal = false) {
            const { limit, skip, institute_id, start_date, end_date, department_id, semester_id, filter, status, user_id, } = query;
            let baseQuery = this.db("users as su")
                .withSchema(this.DBO_SCHEMA)
                .select("su.id", "su.name", "su.email", "su.phone", "su.photo", "su.login_id", "s.status", "d.name as department_name", "d.code as department_code", this.db.raw(`(
            SELECT json_build_object(
              'semester_id', sem.id,
              'semester_name', sem.name,
              'batch_id', b.id,
              'batch_name', b.batch_name,
              'session_id', sess.id,
              'session_no', sess.session_no
            )
            FROM institute.enrollments en
            JOIN institute.batch_semesters j
              ON j.id = en.batch_semester_id
            JOIN institute.semesters sem
              ON sem.id = j.semester_id
            JOIN institute.batch b
              ON b.id = j.batch_id
            JOIN institute.sessions sess
              ON sess.id = b.session_id
            WHERE b.institute_id = ?
              AND en.student_id = s.user_id
              AND en.is_deleted = false
              AND sem.is_deleted = false
              AND sess.is_deleted = false
              AND j.is_deleted = false
              AND b.is_deleted = false
            ORDER BY
              CASE
                WHEN j.start_date <= NOW() AND j.end_date >= NOW() THEN 0
                WHEN j.start_date > NOW() THEN 1
                ELSE 2
              END,
              en.created_at DESC
            LIMIT 1
          ) as session`, [institute_id]), "s.department_id", "su.created_at")
                .joinRaw("LEFT JOIN student.students s ON s.user_id = su.id AND s.is_deleted = false")
                .joinRaw("LEFT JOIN institute.departments d ON d.id = s.department_id")
                .where("su.user_type", constants_1.USER_TYPE.STUDENT)
                .where("s.institute_id", institute_id)
                .andWhere("su.is_deleted", false);
            if (start_date) {
                baseQuery = baseQuery.andWhere("s.created_at", ">=", start_date);
            }
            if (end_date) {
                baseQuery = baseQuery.andWhere("s.created_at", "<=", end_date);
            }
            if (user_id) {
                baseQuery = baseQuery.andWhere("s.user_id", user_id);
            }
            if (status !== undefined) {
                baseQuery = baseQuery.andWhere("s.status", status);
            }
            if (filter) {
                baseQuery = baseQuery.andWhere((qb) => {
                    qb.whereILike("su.name", `%${filter}%`)
                        .orWhereILike("su.email", `%${filter}%`)
                        .orWhereILike("su.phone", `%${filter}%`)
                        .orWhereILike("su.login_id", `%${filter}%`);
                });
            }
            if (department_id) {
                baseQuery = baseQuery.andWhere("s.department_id", department_id);
            }
            //   if (semester_id) {
            //     baseQuery = baseQuery.andWhereRaw(
            //       `
            //     EXISTS (
            //       SELECT 1
            //       FROM institute.enrollments en
            //       JOIN institute.batch_semesters bs ON bs.id = en.batch_semester_id
            //       WHERE en.student_id = s.user_id
            //         AND bs.semester_id = ?
            //         AND en.is_deleted = false
            //         AND bs.is_deleted = false
            //   )
            // `,
            //       [semester_id]
            //     );
            //   }
            if (typeof limit === "number")
                baseQuery = baseQuery.limit(limit);
            if (typeof skip === "number")
                baseQuery = baseQuery.offset(skip);
            baseQuery = baseQuery.orderBy("su.created_at", "desc");
            let total;
            if (isTotal) {
                const result = yield baseQuery
                    .clone()
                    .clearSelect()
                    .clearOrder()
                    .count("su.id as count")
                    .first();
                total = Number((result === null || result === void 0 ? void 0 : result.count) || "0");
            }
            const data = yield baseQuery;
            return { data, total };
        });
    }
    getSingleStudent(_a) {
        return __awaiter(this, arguments, void 0, function* ({ user_id, institute_id, email, phone, roll_no, department_id, semester_id, }) {
            return yield this.db("users as su")
                .withSchema(this.DBO_SCHEMA)
                .select("su.id", "su.name", "su.email", "su.phone", "su.photo", "su.password_hash", "su.login_id", "s.institute_id", "s.status", "s.dob_date", "s.dob_no", "s.religion", "s.gender", "s.blood_group", "s.permanent_address", "s.permanent_thana", "s.permanent_division", "s.permanent_postal_code", "s.present_address", "s.present_thana", "s.present_division", "s.present_postal_code", "s.father_name", "s.father_nid_no", "s.father_phone", "s.mother_name", "s.mother_nid_no", "s.mother_phone", "s.local_guardian_relation", "s.local_guardian_name", "s.local_guardian_nid_no", "s.local_guardian_phone", "s.emergency_phone_no", "s.department_id", "d.name as department_name", "s.created_at", "s.created_by", "cb.name as created_by_name"
            // this.db.raw(
            //   `(SELECT bsbs.roll_no
            //    FROM institute.branch_semester_batch_students bsbs
            //   WHERE bsbs.student_id = su.id
            //     AND bsbs.is_deleted = false
            //     AND bsbs.institute_id = s.institute_id
            //     AND bsbs.department_id = s.department_id
            //     AND bsbs.roll_no IS NOT NULL
            //   ORDER BY bsbs.id DESC LIMIT 1) as roll_no`
            // )
            )
                .joinRaw("LEFT JOIN student.students s ON s.user_id = su.id AND s.is_deleted = false")
                .joinRaw("LEFT JOIN institute.departments d ON d.id = s.department_id AND d.is_deleted = false")
                .joinRaw("LEFT JOIN dbo.users cb ON cb.id = s.created_by")
                .where("s.institute_id", institute_id)
                .andWhere("su.is_deleted", false)
                .andWhere("su.user_type", constants_1.USER_TYPE.STUDENT)
                .andWhere((qb) => {
                if (user_id) {
                    qb.where("su.id", user_id);
                }
                if (email) {
                    qb.where("su.email", email);
                }
                if (phone) {
                    qb.where("su.phone", phone);
                }
                // if (roll_no) {
                //   qb.whereExists(function () {
                //     this.select(qb.client.raw("1"))
                //       .from("institute.branch_semester_batch_students as bsbs")
                //       .whereRaw("bsbs.student_id = su.id")
                //       .andWhere("bsbs.is_deleted", false)
                //       .andWhere("bsbs.institute_id", institute_id)
                //       .andWhere("bsbs.roll_no", roll_no);
                //   });
                // }
                // if (semester_id) {
                //   qb.whereExists(function () {
                //     this.select(qb.client.raw("1"))
                //       .from("institute.branch_semester_batch_students as bsbs")
                //       .whereRaw("bsbs.student_id = su.id")
                //       .andWhere("bsbs.is_deleted", false)
                //       .andWhere("bsbs.institute_id", institute_id)
                //       .andWhere("bsbs.semester_id", semester_id);
                //   });
                // }
                if (department_id) {
                    qb.where("s.department_id", department_id);
                }
            })
                .first();
        });
    }
}
exports.default = StudentModel;
