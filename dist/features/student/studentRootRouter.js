"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRootRouter = void 0;
const express_1 = require("express");
const studentAttendance_controller_1 = __importDefault(require("./router/studentAttendance.controller"));
const studentProfile_router_1 = __importDefault(require("./router/studentProfile.router"));
class StudentRootRouter {
    constructor() {
        this.studentRouter = (0, express_1.Router)();
        this.studentProfileRouter = new studentProfile_router_1.default();
        this.studentAttendanceRouter = new studentAttendance_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.studentRouter.use("/profile", this.studentProfileRouter.router);
        this.studentRouter.use("/attendance", this.studentAttendanceRouter.router);
    }
}
exports.StudentRootRouter = StudentRootRouter;
