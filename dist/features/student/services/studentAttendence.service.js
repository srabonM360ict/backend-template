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
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class StudentAttendanceService extends abstract_service_1.default {
    getStudentSemesterWiseAttendance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id, department_id } = req.student;
            const model = this.Model.StudentAttendanceModel();
            const data = yield model.getStudentSemesterWiseAttendance({
                student_id: user_id,
                institute_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
            };
        });
    }
    getStudentSubjectWiseAttendance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { date } = req.query;
            const { user_id, institute_id, department_id } = req.student;
            const attendanceModel = this.Model.StudentAttendanceModel();
            const data = yield attendanceModel.getStudentSubjectWiseAttendance({
                batch_semester_id: id,
                date,
                student_id: user_id,
                institute_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
            };
        });
    }
}
exports.default = StudentAttendanceService;
