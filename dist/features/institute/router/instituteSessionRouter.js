"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteSession_controller_1 = __importDefault(require("../controller/instituteSession.controller"));
class InstituteSessionRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteSession_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createSession)
            .get(this.controller.getSessions);
        this.router
            .route("/:id")
            .patch(this.controller.updateSession)
            .delete(this.controller.deleteSession);
    }
}
exports.default = InstituteSessionRouter;
