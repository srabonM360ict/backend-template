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
const constants_1 = require("../../utils/miscellaneous/constants");
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class StudentAttendanceModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    getAttendanceSummary(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, isTotal = false) {
            const baseQuery = this.db("institute.batch_semesters as bs")
                .leftJoin("institute.subject_offerings as so", "bs.id", "so.batch_semester_id")
                .leftJoin("institute.subjects as sub", "so.subject_id", "sub.id")
                .leftJoin("student.attendance_sessions as ses", "so.id", "ses.subject_offering_id")
                .leftJoin("student.student_attendance as sa", "ses.id", "sa.attendance_session_id")
                // .leftJoin("institute.enrollments as e", "bs.id", "e.batch_semester_id")
                // .leftJoin("institute.enrollments as e", function () {
                //   this.on("bs.id", "=", "e.batch_semester_id").andOn(
                //     "sa.student_id",
                //     "=",
                //     "e.student_id"
                //   );
                // })
                .leftJoin("institute.enrollments as e", function () {
                this.on("bs.id", "=", "e.batch_semester_id").andOn("sa.enrollment_id", "=", "e.id");
            })
                .leftJoin("institute.departments as d", "e.department_id", "d.id")
                .leftJoin("institute.branches as b", "e.branch_id", "b.id")
                .leftJoin("institute.semesters as sem", "bs.semester_id", "sem.id")
                .leftJoin("institute.batch as batch", "bs.batch_id", "batch.id")
                .leftJoin("dbo.users as s", "e.student_id", "s.id")
                .leftJoin("dbo.users as t", "ses.taken_by", "t.id")
                .andWhere("bs.institute_id", query.institute_id)
                .andWhere("bs.is_deleted", false)
                .andWhere("so.is_deleted", false)
                .andWhere("ses.is_deleted", false)
                .modify((qb) => {
                if (query.batch_semester_id) {
                    qb.andWhere("bs.id", query.batch_semester_id);
                }
                if (query.from_date)
                    qb.andWhere("ses.date", ">=", query.from_date);
                if (query.to_date)
                    qb.andWhere("ses.date", "<=", query.to_date);
                if (query.department_id) {
                    qb.andWhere("d.id", query.department_id);
                }
            })
                .groupBy("ses.date", "sub.name", "t.name", "batch.batch_name", "sem.name", "d.name", "sub.name", "b.name")
                .orderBy("ses.date", "desc");
            const dataQuery = baseQuery
                .clone()
                .select("ses.date as date", "batch.batch_name as batch_name", "sem.name as semester", "b.name as branch_name", "sub.name as subject", "d.name as department", this.db.raw(`SUM(CASE WHEN sa.status = 'present' THEN 1 ELSE 0 END) as present`), this.db.raw(`SUM(CASE WHEN sa.status = 'absent' THEN 1 ELSE 0 END) as absent`), this.db.raw(`SUM(CASE WHEN sa.status = 'leave' THEN 1 ELSE 0 END) as leave`), this.db.raw(`SUM(CASE WHEN sa.status = 'no_action' THEN 1 ELSE 0 END) as no_action`), this.db.raw(`SUM(CASE WHEN sa.status = 'late' THEN 1 ELSE 0 END) as late`), "t.name as teacher")
                .orderBy("ses.date", "desc");
            if (query.limit)
                dataQuery.limit(query.limit);
            if (query.skip)
                dataQuery.offset(query.skip);
            const data = yield dataQuery;
            let total;
            if (isTotal) {
                const result = yield this.db
                    .from(baseQuery
                    .clone()
                    .as("summary")
                    .clearSelect()
                    .select("ses.date", "sub.name", "t.name"))
                    .count("* as total")
                    .first();
                total = Number((result === null || result === void 0 ? void 0 : result.total) || "0");
            }
            return { data, total };
        });
    }
    getStudentAttendanceOverview(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, isTotal = false) {
            const baseQuery = this.db("institute.batch_semesters as bs")
                .leftJoin("institute.subject_offerings as so", function () {
                this.on("bs.id", "so.batch_semester_id");
            })
                .leftJoin("institute.subjects as sub", "so.subject_id", "sub.id")
                .leftJoin("institute.enrollments as e", function () {
                this.on("e.batch_semester_id", "bs.id").andOn("e.is_deleted", "=", database_1.db.raw("?", [false]));
            })
                .leftJoin("student.attendance_sessions as ses", "so.id", "ses.subject_offering_id")
                .leftJoin("student.student_attendance as sa", function () {
                this.on("sa.attendance_session_id", "ses.id").andOn("sa.enrollment_id", "e.id");
            })
                .leftJoin("institute.batch as b", "bs.batch_id", "b.id")
                .leftJoin("institute.semesters as sem", "bs.semester_id", "sem.id")
                .leftJoin("institute.departments as d", "d.id", "e.department_id")
                .where("bs.institute_id", query.institute_id)
                .andWhere("bs.is_deleted", false)
                .andWhere("so.is_deleted", false)
                .modify((qb) => {
                if (query.teacher_id) {
                    qb.andWhere("so.teacher_id", query.teacher_id);
                }
                if (query.start_date && query.end_date)
                    qb.andWhere("bs.start_date", ">=", query.start_date).andWhere("bs.end_date", "<=", query.end_date);
                if (query.branch_id)
                    qb.andWhere("b.branch_id", query.branch_id);
                if (query.status) {
                    if (query.status === constants_1.SEMESTER_STATUS.UPCOMING) {
                        qb.andWhere("bs.start_date", "<=", this.db.fn.now());
                        qb.andWhere("bs.end_date", ">=", this.db.fn.now());
                    }
                    else if (query.status === constants_1.SEMESTER_STATUS.ONGOING) {
                        qb.andWhere("bs.end_date", ">", this.db.fn.now()).andWhere("bs.start_date", "<=", this.db.fn.now());
                    }
                    else if (query.status === constants_1.SEMESTER_STATUS.COMPLETED) {
                        qb.andWhere("bs.end_date", "<", this.db.fn.now());
                    }
                }
                if (query.subject_offering_id)
                    qb.andWhere("so.id", query.subject_offering_id);
                if (query.batch_semester_id)
                    qb.andWhere("bs.id", query.batch_semester_id);
                if (query.batch_id)
                    qb.andWhere("b.id", query.batch_id);
                if (query.roll_no)
                    qb.andWhere("e.roll_no", query.roll_no);
            })
                .groupBy("bs.id", "b.batch_name", "sub.name", "sem.name", "so.id", "d.name")
                .orderBy("b.batch_name", "asc");
            const dataQuery = baseQuery.clone().select("bs.id", "b.batch_name as batch", "sem.name as semester", "sub.name as subject", "bs.start_date as start_date", "bs.end_date as end_date", "d.name as department", this.db.raw("COUNT(DISTINCT e.id) as students"), this.db.raw("COUNT(*) FILTER (WHERE sa.status IS NULL) as attendance_pending"), "so.id as subject_offering_id", this.db.raw(`
      CASE
        WHEN bs.start_date > NOW() THEN '${constants_1.SEMESTER_STATUS.UPCOMING}'
        WHEN bs.start_date <= NOW() AND bs.end_date >= NOW() THEN '${constants_1.SEMESTER_STATUS.ONGOING}'
        WHEN bs.end_date < NOW() THEN '${constants_1.SEMESTER_STATUS.COMPLETED}'
      END as status
    `));
            if (query.limit)
                dataQuery.limit(query.limit);
            if (query.skip)
                dataQuery.offset(query.skip);
            const data = yield dataQuery;
            let total;
            if (isTotal) {
                const result = yield dataQuery
                    .countDistinct("so.id as total")
                    .first();
                total = Number((result === null || result === void 0 ? void 0 : result.total) || "0");
            }
            return { data, total };
        });
    }
    getStudentSemesterWiseAttendance(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseQuery = this.db("institute.batch_semesters as bs")
                .leftJoin("institute.enrollments as e", function () {
                this.on("e.batch_semester_id", "bs.id").andOn("e.is_deleted", "=", database_1.db.raw("?", [false]));
            })
                .leftJoin("institute.departments as d", "d.id", "e.department_id")
                .leftJoin("student.student_attendance as sa", function () {
                this.on("sa.enrollment_id", "e.id");
            })
                .leftJoin("institute.batch as b", "bs.batch_id", "b.id")
                .leftJoin("institute.semesters as sem", "bs.semester_id", "sem.id")
                .where("bs.institute_id", query.institute_id)
                .andWhere("bs.is_deleted", false)
                .modify((qb) => {
                if (query.student_id) {
                    qb.andWhere("e.student_id", query.student_id);
                }
                if (query.from_date)
                    qb.andWhere("bs.date", ">=", query.from_date);
                if (query.to_date)
                    qb.andWhere("bs.date", "<=", query.to_date);
                if (query.branch_id)
                    qb.andWhere("b.branch_id", query.branch_id);
                if (query.status) {
                    if (query.status === constants_1.SEMESTER_STATUS.UPCOMING) {
                        qb.andWhere("bs.start_date", "<=", this.db.fn.now());
                        qb.andWhere("bs.end_date", ">=", this.db.fn.now());
                    }
                    else if (query.status === constants_1.SEMESTER_STATUS.ONGOING) {
                        qb.andWhere("bs.end_date", ">", this.db.fn.now()).andWhere("bs.start_date", "<=", this.db.fn.now());
                    }
                    else if (query.status === constants_1.SEMESTER_STATUS.COMPLETED) {
                        qb.andWhere("bs.end_date", "<", this.db.fn.now());
                    }
                }
                if (query.batch_id)
                    qb.andWhere("b.id", query.batch_id);
                if (query.roll_no)
                    qb.andWhere("e.roll_no", query.roll_no);
            })
                .groupBy("bs.id", "b.batch_name", "sem.name", "d.name", "d.short_name", "d.id", "b.end_date")
                .orderBy("bs.end_date", "desc");
            return yield baseQuery.clone().select("bs.id", "d.name as department", "d.short_name as department_short_name", "d.id as department_id", "b.batch_name as batch", "sem.name as semester", "bs.start_date as start_date", "bs.end_date as end_date", this.db.raw("COUNT(*) FILTER (WHERE sa.status ='present') as total_present"), this.db.raw("COUNT(*) FILTER (WHERE sa.status ='absent') as total_absent"), this.db.raw("COUNT(*) FILTER (WHERE sa.status ='no_action') as total_no_action"), this.db.raw("COUNT(*) FILTER (WHERE sa.status ='leave') as total_leave"), this.db.raw("COUNT(*) FILTER (WHERE sa.status ='late') as total_late"), this.db.raw(`
      CASE
        WHEN bs.start_date > NOW() THEN '${constants_1.SEMESTER_STATUS.UPCOMING}'
        WHEN bs.start_date <= NOW() AND bs.end_date >= NOW() THEN '${constants_1.SEMESTER_STATUS.ONGOING}'
        WHEN bs.end_date < NOW() THEN '${constants_1.SEMESTER_STATUS.COMPLETED}'
      END as status
    `));
        });
    }
    getStudentSubjectWiseAttendance(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("institute.subject_offerings as so")
                .select("so.subject_id", "sub.name as subject_name", "sa.status", "sa.created_at as attendance_time")
                .leftJoin("institute.subjects as sub", "so.subject_id", "sub.id")
                .leftJoin("student.attendance_sessions as ses", function () {
                this.on("ses.subject_offering_id", "so.id").andOn("ses.is_deleted", "=", database_1.db.raw("?", [false]));
            })
                .leftJoin("student.student_attendance as sa", "sa.attendance_session_id", "ses.id")
                .leftJoin("institute.enrollments as e", "sa.enrollment_id", "e.id")
                .where("so.batch_semester_id", query.batch_semester_id)
                .andWhere("so.is_deleted", false)
                .andWhere("ses.is_deleted", false)
                .andWhere("ses.institute_id", query.institute_id)
                .andWhere("ses.date", query.date)
                .andWhere("e.student_id", query.student_id);
        });
    }
    getAttendanceSession(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { batch_semester_id, subject_offering_id, institute_id, branch_id, date, } = query;
            const subjectInfo = yield this.db("institute.subject_offerings as so")
                .leftJoin("institute.subjects as sub", "so.subject_id", "sub.id")
                .select("so.id", "sub.name as subject_name")
                .where("so.id", subject_offering_id)
                .andWhere("so.is_deleted", false)
                .first();
            if (!subjectInfo) {
                throw new Error("Assign subject not found");
            }
            let session = yield this.db("student.attendance_sessions as ses")
                .select("ses.id", "ses.date", "ses.is_submitted", "ses.created_at")
                .where("ses.subject_offering_id", subject_offering_id)
                .andWhere("ses.institute_id", institute_id)
                .andWhere("ses.date", date)
                .andWhere((qb) => {
                if (branch_id) {
                    qb.andWhere("ses.branch_id", branch_id);
                }
            })
                .andWhere("ses.is_deleted", false)
                .first();
            if (!session) {
                session = {
                    id: null,
                    date,
                    is_submitted: false,
                    created_at: null,
                };
            }
            const totalStudentsQuery = this.db("institute.enrollments as e")
                .count("* as total")
                .where("e.batch_semester_id", batch_semester_id)
                .andWhere("e.institute_id", institute_id)
                .andWhere("e.is_deleted", false);
            if (branch_id) {
                totalStudentsQuery.andWhere("e.branch_id", branch_id);
            }
            const totalStudentsResult = yield totalStudentsQuery.first();
            const totalStudents = parseInt((totalStudentsResult === null || totalStudentsResult === void 0 ? void 0 : totalStudentsResult.total) || "0");
            let presentCount = 0, absentCount = 0, lateCount = 0, leaveCount = 0;
            if (session.id) {
                const attendanceStats = yield this.db("student.student_attendance as sa")
                    .leftJoin("institute.enrollments as e", "sa.enrollment_id", "e.id")
                    .select(this.db.raw("SUM(CASE WHEN sa.status = 'present' THEN 1 ELSE 0 END) as present_count"), this.db.raw("SUM(CASE WHEN sa.status = 'absent' THEN 1 ELSE 0 END) as absent_count"), this.db.raw("SUM(CASE WHEN sa.status = 'late' THEN 1 ELSE 0 END) as late_count"), this.db.raw("SUM(CASE WHEN sa.status = 'leave' THEN 1 ELSE 0 END) as leave_count"))
                    .where("sa.attendance_session_id", session.id)
                    .andWhere("e.batch_semester_id", batch_semester_id)
                    .andWhere("e.institute_id", institute_id)
                    .andWhere((qb) => {
                    if (branch_id) {
                        qb.andWhere("e.branch_id", branch_id);
                    }
                })
                    .andWhere("e.is_deleted", false)
                    .first();
                presentCount = parseInt((attendanceStats === null || attendanceStats === void 0 ? void 0 : attendanceStats.present_count) || "0");
                absentCount = parseInt((attendanceStats === null || attendanceStats === void 0 ? void 0 : attendanceStats.absent_count) || "0");
                lateCount = parseInt((attendanceStats === null || attendanceStats === void 0 ? void 0 : attendanceStats.late_count) || "0");
                leaveCount = parseInt((attendanceStats === null || attendanceStats === void 0 ? void 0 : attendanceStats.leave_count) || "0");
            }
            const totalRecorded = presentCount + absentCount + lateCount + leaveCount;
            const noActionCount = totalStudents - totalRecorded;
            return {
                id: session.id,
                subject_offering_id,
                subject_name: subjectInfo.subject_name,
                date: session.date,
                is_submitted: session.is_submitted,
                created_at: session.created_at,
                total_students: totalStudents,
                present_count: presentCount,
                absent_count: absentCount,
                late_count: lateCount,
                leave_count: leaveCount,
                no_action_count: noActionCount,
            };
        });
    }
    getBatchAttendance(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { batch_semester_id, subject_offering_id, branch_id, institute_id, attendance_session_id, date, } = query;
            const subjectInfo = yield this.db("institute.subject_offerings as so")
                .leftJoin("institute.subjects as sub", "so.subject_id", "sub.id")
                .where("so.id", subject_offering_id)
                .andWhere("so.is_deleted", false)
                .first();
            if (!subjectInfo) {
                throw new Error("Assign subject not found");
            }
            const baseQuery = this.db("institute.enrollments as e")
                .select("e.roll_no", "u.name as student_name", "u.id as student_id", "e.id as enrollment_id")
                .leftJoin("dbo.users as u", "e.student_id", "u.id")
                .where("e.batch_semester_id", batch_semester_id)
                .andWhere("e.institute_id", institute_id)
                .andWhere((qb) => {
                if (branch_id) {
                    qb.andWhere("e.branch_id", branch_id);
                }
            })
                .andWhere("e.is_deleted", false)
                .orderBy("e.roll_no", "asc");
            return yield baseQuery
                .select("sa.id as student_attendance_id", "ses.id as attendance_session_id", this.db.raw("COALESCE(sa.created_at, null) as attendance_time"), this.db.raw("COALESCE(sa.enrollment_id, e.id) as enrollment_id"), this.db.raw("COALESCE(sa.status, 'no_action') as status"))
                .leftJoin("student.attendance_sessions as ses", function () {
                this.on("ses.subject_offering_id", "=", database_1.db.raw("?", [subject_offering_id]))
                    .andOn("ses.institute_id", "=", database_1.db.raw("?", [institute_id]))
                    .andOn("ses.date", "=", database_1.db.raw("?", [date]))
                    .andOn("ses.is_deleted", "=", database_1.db.raw("?", [false]));
            })
                .leftJoin("student.student_attendance as sa", function () {
                this.on("sa.enrollment_id", "e.id").andOn("sa.attendance_session_id", "ses.id");
            })
                .andWhere((qb) => {
                if (attendance_session_id) {
                    qb.andWhere("sa.attendance_session_id", attendance_session_id);
                }
            });
        });
    }
    createAttendanceSession(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("attendance_sessions")
                .withSchema("student")
                .insert(payload, "id");
        });
    }
    checkAttendanceSessionExists(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("attendance_sessions")
                .withSchema(this.STUDENT_SCHEMA)
                .select("id")
                .where("is_deleted", false)
                .where(payload)
                .first();
        });
    }
    createStudentAttendance(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("student_attendance")
                .withSchema(this.STUDENT_SCHEMA)
                .insert(payload)
                .onConflict(["attendance_session_id", "enrollment_id", "institute_id"])
                .merge({
                status: payload.status,
            });
        });
    }
    checkStudentAttendanceExists(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { student_attendance_id } = query;
            return yield this.db("student_attendance")
                .withSchema(this.STUDENT_SCHEMA)
                .select("id", "attendance_session_id")
                .where((qb) => {
                // qb.where("is_deleted", false);
                qb.andWhere("institute_id", query.institute_id);
                if (student_attendance_id) {
                    qb.andWhere("id", student_attendance_id);
                }
                if (query.enrollment_id) {
                    qb.andWhere("enrollment_id", query.enrollment_id);
                }
            })
                .first();
        });
    }
    updateStudentAttendance(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("student_attendance")
                .withSchema(this.STUDENT_SCHEMA)
                .update(payload)
                .where("id", id);
        });
    }
    teacherSubjectOffering(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("institute.subject_offerings as so")
                .select("so.id as subject_offering_id", "sub.name as subject_name", "sub.id as subject_id", "t.name as teacher_name", "sem.name as batch_semester_name", "bs.id as batch_semester_id")
                .distinct("sub.id")
                .leftJoin("institute.batch_semesters as bs", "so.batch_semester_id", "bs.id")
                .leftJoin("institute.semesters as sem", "bs.semester_id", "sem.id")
                .leftJoin("institute.subjects as sub", "so.subject_id", "sub.id")
                .leftJoin("dbo.users as t", "so.teacher_id", "t.id")
                .where((qb) => {
                qb.andWhere("so.is_deleted", false);
                qb.andWhere("bs.is_deleted", false);
                qb.andWhere("t.is_deleted", false);
                qb.andWhere("sub.is_deleted", false);
                qb.where("t.id", query.teacher_id);
                qb.andWhere("so.institute_id", query.institute_id);
                if (query.filter) {
                    qb.andWhereILike("sub.name", `%${query.filter}%`);
                }
                if (query.department_id !== undefined) {
                    qb.andWhere("so.department_id", query.department_id);
                }
                if (query.batch_semester_id !== undefined) {
                    qb.andWhere("so.batch_semester_id", query.batch_semester_id);
                }
            });
        });
    }
}
exports.default = StudentAttendanceModel;
