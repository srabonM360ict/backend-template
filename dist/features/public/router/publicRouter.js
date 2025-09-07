"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const publicController_1 = __importDefault(require("../controller/publicController"));
class PublicRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.Controller = new publicController_1.default();
        this.callRouter();
    }
    callRouter() {
        // send email otp router
        this.router.post("/send-email-otp", this.Controller.sendEmailOtpController);
        //match otp email
        this.router.post("/match-email-otp", this.Controller.matchEmailOtpController);
        this.router
            .route("/device-token")
            .post(this.Controller.addDeviceToken)
            .delete(this.Controller.removeDeviceToken);
        this.router
            .route("/notification")
            .get(this.Controller.getAllNotification)
            .delete(this.Controller.deleteNotification)
            .patch(this.Controller.readNotification);
    }
}
exports.default = PublicRouter;
