"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteSemester_controller_1 = __importDefault(require("../controller/instituteSemester.controller"));
class InstituteSemesterRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteSemester_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createSemester)
            .get(this.controller.getSemesters);
        this.router
            .route("/:id")
            .patch(this.controller.updateSemester)
            .delete(this.controller.deleteSemester);
    }
}
exports.default = InstituteSemesterRouter;
