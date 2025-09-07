"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const managementAdministration_controller_1 = __importDefault(require("../controller/managementAdministration.controller"));
class ManagementAdministrationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new managementAdministration_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create role, view role
        this.router
            .route("/role")
            .post(this.controller.createRole)
            .get(this.controller.roleList);
        //create permission, view permission
        this.router
            .route("/permission")
            .post(this.controller.createPermission)
            .get(this.controller.permissionList);
        //get role permissions, update role permissions
        this.router
            .route("/role/:id")
            .get(this.controller.getSingleRolePermission)
            .patch(this.controller.updateRolePermissions);
        //create management, view management
        this.router
            .route("/management")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.management_FILES), this.controller.createManagement)
            .get(this.controller.getAllManagement);
        //get single Management, update Management
        this.router
            .route("/management/:id")
            .get(this.controller.getSingleManagement)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.management_FILES), this.controller.updateManagement);
    }
}
exports.default = ManagementAdministrationRouter;
