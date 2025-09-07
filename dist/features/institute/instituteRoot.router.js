"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const instituteAdministrationRouter_1 = __importDefault(require("./router/instituteAdministrationRouter"));
const instituteBatchRouter_1 = __importDefault(require("./router/instituteBatchRouter"));
const instituteBatchWiseSemesterRouter_1 = __importDefault(require("./router/instituteBatchWiseSemesterRouter"));
const instituteBranchRouter_1 = __importDefault(require("./router/instituteBranchRouter"));
const instituteDashboardRouter_1 = __importDefault(require("./router/instituteDashboardRouter"));
const instituteDepartmentRouter_1 = __importDefault(require("./router/instituteDepartmentRouter"));
const instituteProfile_router_1 = __importDefault(require("./router/instituteProfile.router"));
const instituteSemesterRouter_1 = __importDefault(require("./router/instituteSemesterRouter"));
const instituteSessionRouter_1 = __importDefault(require("./router/instituteSessionRouter"));
const instituteStudentEnrollmentRouter_1 = __importDefault(require("./router/instituteStudentEnrollmentRouter"));
const instituteStudentRouter_1 = __importDefault(require("./router/instituteStudentRouter"));
const instituteSubjectOfferingRouter_1 = __importDefault(require("./router/instituteSubjectOfferingRouter"));
const instituteSubjectRouter_1 = __importDefault(require("./router/instituteSubjectRouter"));
const instituteTeacherRouter_1 = __importDefault(require("./router/instituteTeacherRouter"));
class instituteRootRouter {
    constructor() {
        this.instituteRouter = (0, express_1.Router)();
        this.instituteProfileRouter = new instituteProfile_router_1.default();
        this.instituteDepartmentRouter = new instituteDepartmentRouter_1.default();
        this.instituteSubjectRouter = new instituteSubjectRouter_1.default();
        this.instituteSemesterRouter = new instituteSemesterRouter_1.default();
        this.instituteStudentRouter = new instituteStudentRouter_1.default();
        this.instituteTeacherRouter = new instituteTeacherRouter_1.default();
        this.instituteSessionRouter = new instituteSessionRouter_1.default();
        this.instituteBatchRouter = new instituteBatchRouter_1.default();
        this.instituteBranchRouter = new instituteBranchRouter_1.default();
        this.instituteSubjectOfferingRouter = new instituteSubjectOfferingRouter_1.default();
        this.instituteBatchWiseSemesterRouter = new instituteBatchWiseSemesterRouter_1.default();
        this.instituteStudentEnrollmentRouter = new instituteStudentEnrollmentRouter_1.default();
        this.instituteDashboardRouter = new instituteDashboardRouter_1.default();
        this.instituteAdministrationRouter = new instituteAdministrationRouter_1.default();
        this.callRouter();
    }
    callRouter() {
        // profile router
        this.instituteRouter.use("/profile", this.instituteProfileRouter.router);
        // department router
        this.instituteRouter.use("/department", this.instituteDepartmentRouter.router);
        // subject router
        this.instituteRouter.use("/subject", this.instituteSubjectRouter.router);
        // institute router
        this.instituteRouter.use("/semester", this.instituteSemesterRouter.router);
        // student router
        this.instituteRouter.use("/student", this.instituteStudentRouter.router);
        // teacher router
        this.instituteRouter.use("/teacher", this.instituteTeacherRouter.router);
        // session router
        this.instituteRouter.use("/session", this.instituteSessionRouter.router);
        // batch router
        this.instituteRouter.use("/batch", this.instituteBatchRouter.router);
        // branch router
        this.instituteRouter.use("/branch", this.instituteBranchRouter.router);
        // assign subject router
        this.instituteRouter.use("/subject-offering", this.instituteSubjectOfferingRouter.router);
        // batch wise semester router
        this.instituteRouter.use("/batch-wise-semester", this.instituteBatchWiseSemesterRouter.router);
        // student enrollment router
        this.instituteRouter.use("/student-enrollment", this.instituteStudentEnrollmentRouter.router);
        // Dashboard router
        this.instituteRouter.use("/dashboard", this.instituteDashboardRouter.router);
        // Administration router
        this.instituteRouter.use("/administration", this.instituteAdministrationRouter.router);
    }
}
exports.default = instituteRootRouter;
