"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteSubject_controller_1 = __importDefault(require("../controller/instituteSubject.controller"));
class InstituteSubjectRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteSubject_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createSubject)
            .get(this.controller.getSubjects);
        this.router
            .route("/:id")
            .patch(this.controller.updateSubject)
            .delete(this.controller.deleteSubject);
    }
}
exports.default = InstituteSubjectRouter;
