"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteBranch_controller_1 = __importDefault(require("../controller/instituteBranch.controller"));
class InstituteBranchRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteBranch_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createBranch)
            .get(this.controller.getBranches);
        this.router
            .route("/:id")
            .patch(this.controller.updateBranch)
            .delete(this.controller.deleteBranch);
    }
}
exports.default = InstituteBranchRouter;
