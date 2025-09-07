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
class InstituteDashboardModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    getDashboardData(_a) {
        return __awaiter(this, arguments, void 0, function* ({ institute_id }) {
            const studentStats = yield this.db("student.students as s")
                .select(this.db.raw("COUNT(DISTINCT s.id) as total_students"), this.db.raw("COUNT(DISTINCT e.id) as total_enrollments"), this.db.raw("COUNT(sa.*) FILTER (WHERE sa.status = 'present' AND sa.created_at::date = CURRENT_DATE) as total_present_today"), this.db.raw("COUNT(sa.*) FILTER (WHERE sa.status = 'absent' AND sa.created_at::date = CURRENT_DATE) as total_absent_today"), this.db.raw("COUNT(sa.*) FILTER (WHERE sa.status = 'absent' AND sa.created_at::date = CURRENT_DATE) as total_absent_today"), this.db.raw("COUNT(sa.*) FILTER (WHERE sa.status = 'late' AND sa.created_at::date = CURRENT_DATE) as total_late_today"), this.db.raw("COUNT(sa.*) FILTER (WHERE sa.status = 'leave' AND sa.created_at::date = CURRENT_DATE) as total_leave_today"), this.db.raw("COUNT(sa.*) FILTER (WHERE sa.status = 'no_action' AND sa.created_at::date = CURRENT_DATE) as total_no_action_today"), this.db.raw(`
        CASE
          WHEN COUNT(sa.*) = 0 THEN 0
          ELSE ROUND(100.0 * SUM(CASE WHEN sa.status = 'present' THEN 1 ELSE 0 END) / COUNT(sa.*), 2)
        END as overall_attendance_percentage
      `))
                .leftJoin("institute.enrollments as e", "e.student_id", "s.user_id")
                .leftJoin("student.student_attendance as sa", "sa.enrollment_id", "e.id")
                .where("s.is_deleted", false)
                .andWhere("s.institute_id", institute_id)
                .first();
            const academicStats = yield this.db
                .select(this.db("institute.departments")
                .count("*")
                .where("is_deleted", false)
                .andWhere("institute_id", institute_id)
                .as("total_departments"), this.db("institute.branches")
                .count("*")
                .where("is_deleted", false)
                .andWhere("institute_id", institute_id)
                .as("total_branches"), this.db("institute.batch")
                .count("*")
                .where("is_deleted", false)
                .andWhere("institute_id", institute_id)
                .as("total_batches"), this.db("institute.batch")
                .count("*")
                .where("status", "running")
                .andWhere("is_deleted", false)
                .andWhere("institute_id", institute_id)
                .as("running_batches"), this.db("institute.batch")
                .count("*")
                .where("status", "completed")
                .andWhere("is_deleted", false)
                .andWhere("institute_id", institute_id)
                .as("completed_batches"), this.db("institute.semesters")
                .count("*")
                .where("is_deleted", false)
                .andWhere("institute_id", institute_id)
                .as("total_semesters"), this.db("institute.subjects")
                .count("*")
                .where("is_deleted", false)
                .andWhere("institute_id", institute_id)
                .as("total_subjects"), this.db("institute.subject_offerings")
                .count("*")
                .where("is_deleted", false)
                .andWhere("institute_id", institute_id)
                .as("total_subject_offerings"))
                .first();
            const attendanceStats = yield this.db("student_attendance as sa")
                .withSchema(this.STUDENT_SCHEMA)
                .select(this.db.raw("COUNT(*) as total_records"), this.db.raw("COUNT(*) FILTER (WHERE sa.status = 'present') as present_count"), this.db.raw("COUNT(*) FILTER (WHERE sa.status = 'absent') as absent_count"), this.db.raw("COUNT(*) FILTER (WHERE sa.status = 'late') as late_count"), this.db.raw("COUNT(*) FILTER (WHERE sa.status = 'leave') as leave_count"), this.db.raw("COUNT(*) FILTER (WHERE sa.status = 'no_action') as no_action_count"), this.db.raw(`
        CASE
          WHEN COUNT(*) = 0 THEN 0
          ELSE ROUND(100.0 * COUNT(*) FILTER (WHERE sa.status = 'present') / COUNT(*), 2)
        END as attendance_percentage
      `))
                .where("sa.institute_id", institute_id)
                // .andWhere("sa.is_deleted", false)
                .first();
            const teacherStats = yield this.db("teacher.teachers as t")
                .select(this.db.raw("COUNT(*) as total_teachers"), this.db.raw("COUNT(DISTINCT so.teacher_id) as assigned_teachers"))
                .where("t.is_deleted", false)
                .andWhere("t.institute_id", institute_id)
                .leftJoin("institute.subject_offerings as so", function () {
                this.on("so.teacher_id", "t.user_id").andOn("so.institute_id", "=", "t.institute_id");
            })
                .first();
            const attendanceTrend = yield this.db("student_attendance as sa")
                .withSchema(this.STUDENT_SCHEMA)
                .select(this.db.raw("sa.created_at::date as date"), this.db.raw("COUNT(*) FILTER (WHERE status = 'present') as present_count"), this.db.raw("COUNT(*) FILTER (WHERE status = 'absent') as absent_count"), this.db.raw("COUNT(*) FILTER (WHERE status = 'late') as late_count"), this.db.raw("COUNT(*) FILTER (WHERE status = 'no_action') as no_action_count"), this.db.raw("COUNT(*) FILTER (WHERE status = 'leave') as leave_count"))
                .where("sa.institute_id", institute_id)
                .andWhereRaw("sa.created_at >= CURRENT_DATE - INTERVAL '7 days'")
                .groupByRaw("sa.created_at::date")
                .orderByRaw("sa.created_at::date");
            return {
                students: studentStats,
                academics: academicStats,
                attendance: attendanceStats,
                teachers: teacherStats,
                attendance_trend: attendanceTrend,
            };
        });
    }
}
exports.default = InstituteDashboardModel;
