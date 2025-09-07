"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteBatchWiseSemester_controller_1 = __importDefault(require("../controller/instituteBatchWiseSemester.controller"));
class InstituteBatchWiseSemesterRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteBatchWiseSemester_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createBatchWiseSemester)
            .get(this.controller.getAllBatchWiseSemester);
        this.router
            .route("/:id")
            .patch(this.controller.updateBatchWiseSemester)
            .delete(this.controller.deleteBatchWiseSemester);
    }
}
exports.default = InstituteBatchWiseSemesterRouter;
