"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteDashboard_controller_1 = __importDefault(require("../controller/instituteDashboard.controller"));
class InstituteDashboardRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteDashboard_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router.route("/").get(this.controller.getDashboardData);
    }
}
exports.default = InstituteDashboardRouter;
