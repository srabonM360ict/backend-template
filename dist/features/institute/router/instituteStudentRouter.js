"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteStudent_controller_1 = __importDefault(require("../controller/instituteStudent.controller"));
class InstituteStudentRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteStudent_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createStudent)
            .get(this.controller.getAllStudent);
        this.router
            .route("/:id")
            .get(this.controller.getSingleStudent)
            .patch(this.controller.updateStudent)
            .delete(this.controller.deleteStudent);
    }
}
exports.default = InstituteStudentRouter;
