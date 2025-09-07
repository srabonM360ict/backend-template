"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const auth_teacher_controller_1 = __importDefault(require("../controller/auth.teacher.controller"));
class TeacherAuthRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new auth_teacher_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //login
        this.router.route("/login").post(this.controller.login);
        //forget password
        this.router
            .route("/forget-password")
            .post(this.controller.forgetPassword);
    }
}
exports.default = TeacherAuthRouter;
