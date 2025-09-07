"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteDepartment_controller_1 = __importDefault(require("../controller/instituteDepartment.controller"));
class InstituteDepartmentRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteDepartment_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createDepartment)
            .get(this.controller.getDepartments);
        this.router
            .route("/:id")
            // .get(this.controller.getSingleDepartment)
            .patch(this.controller.updateDepartment)
            .delete(this.controller.deleteDepartment);
    }
}
exports.default = InstituteDepartmentRouter;
