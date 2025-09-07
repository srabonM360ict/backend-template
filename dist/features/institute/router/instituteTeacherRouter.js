"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteTeacher_controller_1 = __importDefault(require("../controller/instituteTeacher.controller"));
class InstituteTeacherRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteTeacher_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createTeacher)
            .get(this.controller.getAllTeacher);
        this.router
            .route("/:id")
            .get(this.controller.getSingleTeacher)
            .patch(this.controller.updateTeacher)
            .delete(this.controller.deleteTeacher);
    }
}
exports.default = InstituteTeacherRouter;
