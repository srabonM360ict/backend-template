"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const managementInstitute_controller_1 = __importDefault(require("../controller/managementInstitute.controller"));
class ManagementInstituteRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new managementInstitute_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.INSTITUTE_FILES), this.controller.instituteRegistration)
            .get(this.controller.getAllInstitute);
        this.router
            .route("/:id")
            .get(this.controller.getSingleInstitute)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.INSTITUTE_FILES), this.controller.updateInstitute);
    }
}
exports.default = ManagementInstituteRouter;
