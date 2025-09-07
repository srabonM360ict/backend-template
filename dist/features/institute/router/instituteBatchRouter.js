"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const instituteBatch_controller_1 = __importDefault(require("../controller/instituteBatch.controller"));
class InstituteBatchRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new instituteBatch_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createBatch)
            .get(this.controller.getAllBatch);
        this.router
            .route("/:id")
            .get(this.controller.getSingleBatch)
            .patch(this.controller.updateBatch)
            .delete(this.controller.deleteBatch);
    }
}
exports.default = InstituteBatchRouter;
