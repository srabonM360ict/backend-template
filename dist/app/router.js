"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoot_router_1 = __importDefault(require("../features/auth/authRoot.router"));
const authChecker_1 = __importDefault(require("../middleware/authChecker/authChecker"));
class RootRouter {
    constructor() {
        this.Router = (0, express_1.Router)();
        this.authRootRouter = new authRoot_router_1.default();
        // Auth checker
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        // Auth Routes
        this.Router.use("/auth", this.authRootRouter.AuthRouter);
    }
}
exports.default = RootRouter;
