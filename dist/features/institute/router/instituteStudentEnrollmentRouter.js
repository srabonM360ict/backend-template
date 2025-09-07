"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteStudentEnrollment_controller_1 = __importDefault(require("../controller/instituteStudentEnrollment.controller"));
class InstituteStudentEnrollmentRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteStudentEnrollment_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createStudentEnrollment)
            .get(this.controller.getAllStudentEnrollment);
        this.router
            .route("/attendance-summary")
            .get(this.controller.getStudentAttendanceSummary);
        this.router
            .route("/:id")
            .get(this.controller.getSingleStudentEnrollment)
            .patch(this.controller.updateStudentEnrollment)
            .delete(this.controller.deleteStudentEnrollment);
    }
}
exports.default = InstituteStudentEnrollmentRouter;
