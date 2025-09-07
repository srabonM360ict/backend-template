"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteAdministration_controller_1 = __importDefault(require("../controller/instituteAdministration.controller"));
class InstituteAdministrationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteAdministration_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router.route("/audit-logs").get(this.controller.getAuditData);
        this.router.route("/error-logs").get(this.controller.getErrorLogs);
    }
}
exports.default = InstituteAdministrationRouter;
