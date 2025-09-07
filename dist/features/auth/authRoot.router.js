"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class AuthRootRouter {
    constructor() {
        this.AuthRouter = (0, express_1.Router)();
        this.callRouter();
    }
    callRouter() { }
}
exports.default = AuthRootRouter;
