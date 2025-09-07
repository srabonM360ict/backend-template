"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherRootRouter = void 0;
const express_1 = require("express");
const teacherProfile_router_1 = __importDefault(require("./router/teacherProfile.router"));
const teacherStudentAttendace_router_1 = __importDefault(require("./router/teacherStudentAttendace.router"));
const teacherSubjectOffering_router_1 = __importDefault(require("./router/teacherSubjectOffering.router"));
class TeacherRootRouter {
    constructor() {
        this.teacherRouter = (0, express_1.Router)();
        this.teacherProfileRouter = new teacherProfile_router_1.default();
        this.teacherSubjectOfferingRouter = new teacherSubjectOffering_router_1.default();
        this.callRouter();
    }
    callRouter() {
        this.teacherRouter.use("/profile", this.teacherProfileRouter.router);
        this.teacherRouter.use("/subject-offering", this.teacherSubjectOfferingRouter.router);
        this.teacherRouter.use("/student-attendance", new teacherStudentAttendace_router_1.default().router);
    }
}
exports.TeacherRootRouter = TeacherRootRouter;
