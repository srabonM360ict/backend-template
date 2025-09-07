"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const studentProfile_controller_1 = __importDefault(require("../controller/studentProfile.controller"));
class StudentProfileRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new studentProfile_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //view profile, edit profile
        this.router
            .route("/")
            .get(this.controller.getProfile)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.STUDENT_FILES), this.controller.editProfile);
        //change password
        this.router.route("/change-password").post(this.controller.changePassword);
    }
}
exports.default = StudentProfileRouter;
