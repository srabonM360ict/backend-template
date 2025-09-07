"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const teacherStudentAttendance_controller_1 = __importDefault(require("../controller/teacherStudentAttendance.controller"));
class TeacherStudentAttendanceRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new teacherStudentAttendance_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .get(this.controller.getStudentAttendance)
            .post(this.controller.takeStudentAttendance);
        this.router.route("/branch").get(this.controller.getBranches);
        this.router
            .route("/:id")
            .get(this.controller.getBatchAttendance)
            .patch(this.controller.updateStudentAttendance);
    }
}
exports.default = TeacherStudentAttendanceRouter;
