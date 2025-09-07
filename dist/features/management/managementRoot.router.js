"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const managementAdministration_router_1 = __importDefault(require("./router/managementAdministration.router"));
const managementInstitute_router_1 = __importDefault(require("./router/managementInstitute.router"));
const managementProfile_router_1 = __importDefault(require("./router/managementProfile.router"));
class managementRootRouter {
    constructor() {
        this.managementRouter = (0, express_1.Router)();
        this.managementAdministrationRouter = new managementAdministration_router_1.default();
        this.managementProfileRouter = new managementProfile_router_1.default();
        this.managementInstituteRouter = new managementInstitute_router_1.default();
        this.callRouter();
    }
    callRouter() {
        //Administration
        this.managementRouter.use("/administration", this.managementAdministrationRouter.router);
        // profile router
        this.managementRouter.use("/profile", this.managementProfileRouter.router);
        // Institute
        this.managementRouter.use("/institute", this.managementInstituteRouter.router);
    }
}
exports.default = managementRootRouter;
