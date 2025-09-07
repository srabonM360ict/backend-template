"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const studentAttendance_controller_1 = __importDefault(require("../controller/studentAttendance.controller"));
class StudentAttendanceRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new studentAttendance_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //view attendance, edit attendance
        this.router
            .route("/semester")
            .get(this.controller.getStudentSemesterWiseAttendance);
        this.router
            .route("/semester/:id")
            .get(this.controller.getStudentSubjectWiseAttendance);
    }
}
exports.default = StudentAttendanceRouter;
