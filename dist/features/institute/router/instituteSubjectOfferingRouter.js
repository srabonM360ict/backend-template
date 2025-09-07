"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteSubjectOffering_controller_1 = __importDefault(require("../controller/instituteSubjectOffering.controller"));
class InstituteSubjectOfferingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteSubjectOffering_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createSubjectOffering)
            .get(this.controller.getSubjectOfferings);
        this.router
            .route("/:id")
            .delete(this.controller.deleteSubjectOffering)
            .patch(this.controller.updateSubjectOffering);
    }
}
exports.default = InstituteSubjectOfferingRouter;
