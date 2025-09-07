"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../../app/config"));
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const constants_1 = require("../../../utils/miscellaneous/constants");
const sendEmailOtpTemplate_1 = require("../../../utils/templates/sendEmailOtpTemplate");
class PublicService extends abstract_service_1.default {
    constructor() {
        super();
        this.commonAuthChecker = (req) => __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (!authorization) {
                throw new customError_1.default(this.ResMsg.HTTP_UNAUTHORIZED, this.StatusCode.HTTP_UNAUTHORIZED);
            }
            const authSplit = authorization.split(" ");
            if (authSplit.length !== 2) {
                throw new customError_1.default(this.ResMsg.HTTP_UNAUTHORIZED, this.StatusCode.HTTP_UNAUTHORIZED);
            }
            let decodeData = null;
            // const verifyManagement = Lib.verifyToken(
            //   authSplit[1],
            //   config.JWT_SECRET_MANAGEMENT
            // ) as ITokenParseManagement;
            // if (verifyManagement) {
            //   decodeData = verifyManagement;
            // }
            const verifyInstitute = lib_1.default.verifyToken(authSplit[1], config_1.default.JWT_SECRET_INSTITUTE);
            if (verifyInstitute) {
                decodeData = verifyInstitute;
            }
            // const verifyAgent = Lib.verifyToken(
            //   authSplit[1],
            //   config.JWT_SECRET_AGENT
            // ) as ITokenParseAgent;
            // if (verifyAgent) {
            //   decodeData = verifyAgent;
            // }
            // const verifyB2c = Lib.verifyToken(
            //   authSplit[1],
            //   config.JWT_SECRET_B2C
            // ) as ITokenParseB2c;
            // if (verifyB2c) {
            //   decodeData = verifyB2c;
            // }
            if (!decodeData) {
                throw new customError_1.default(this.ResMsg.HTTP_UNAUTHORIZED, this.StatusCode.HTTP_UNAUTHORIZED);
            }
            return decodeData;
        });
    }
    //send email otp service
    sendOtpToEmailService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { email, type } = req.body;
                const userModel = this.Model.UserModel(trx);
                const CommonModel = this.Model.CommonModel(trx);
                const checkOtp = yield CommonModel.getOTP({
                    email: email,
                    type: type,
                    interval: "1",
                });
                if (checkOtp.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_GONE,
                        message: this.ResMsg.THREE_TIMES_EXPIRED,
                        data: {
                            remaining_retry_time: lib_1.default.remainingRetrySeconds(checkOtp[0].create_date, 120),
                        },
                    };
                }
                let OTP_FOR = "";
                switch (type) {
                    // Reset management
                    case constants_1.OTP_TYPES.reset_management:
                        const management_details = yield userModel.getSingleCommonAuthUser({
                            email,
                            schema_name: "management",
                            table_name: constants_1.USER_AUTHENTICATION_VIEW.MANAGEMENT,
                        });
                        if (!management_details) {
                            throw new customError_1.default(this.ResMsg.NOT_FOUND_USER_WITH_EMAIL, this.StatusCode.HTTP_NOT_FOUND);
                        }
                        OTP_FOR = "reset management";
                        break;
                    // Reset Agent
                    // case OTP_TYPES.reset_agent:
                    //   const agent_details =
                    //     await userModel.getSingleCommonAuthUser<IManagementAuthView>({
                    //       email,
                    //       schema_name: "agent",
                    //       table_name: USER_AUTHENTICATION_VIEW.AGENT,
                    //     });
                    //   if (!agent_details) {
                    //     throw new CustomError(
                    //       this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                    //       this.StatusCode.HTTP_NOT_FOUND
                    //     );
                    //   }
                    //   OTP_FOR = "reset agent";
                    //   break;
                    // // Reset Supplier
                    // case OTP_TYPES.reset_supplier:
                    //   const supplier_details =
                    //     await userModel.getSingleCommonAuthUser<IManagementAuthView>({
                    //       email,
                    //       schema_name: "supplier",
                    //       table_name: USER_AUTHENTICATION_VIEW.SUPPLIER,
                    //     });
                    //   if (!supplier_details) {
                    //     throw new CustomError(
                    //       this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                    //       this.StatusCode.HTTP_NOT_FOUND
                    //     );
                    //   }
                    //   OTP_FOR = "reset supplier";
                    //   break;
                    // // Reset B2c
                    // case OTP_TYPES.reset_b2c:
                    //   const b2c_detail =
                    //     await userModel.getSingleCommonAuthUser<IManagementAuthView>({
                    //       email,
                    //       schema_name: "b2c",
                    //       table_name: USER_AUTHENTICATION_VIEW.management,
                    //     });
                    //   if (!b2c_detail) {
                    //     throw new CustomError(
                    //       this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                    //       this.StatusCode.HTTP_NOT_FOUND
                    //     );
                    //   }
                    //   OTP_FOR = "reset user";
                    //   break;
                    // // Register B2c
                    // case OTP_TYPES.register_b2c:
                    //   const check_b2c = await userModel.getSingleCommonAuthUser({
                    //     email,
                    //     schema_name: "b2c",
                    //     table_name: USER_AUTHENTICATION_VIEW.B2C,
                    //   });
                    //   if (check_b2c) {
                    //     throw new CustomError(
                    //       this.ResMsg.EMAIL_ALREADY_EXISTS,
                    //       this.StatusCode.HTTP_CONFLICT
                    //     );
                    //   }
                    //   OTP_FOR = "register user";
                    //   break;
                    default:
                        throw new customError_1.default("Invalid OTP Type", this.StatusCode.HTTP_BAD_REQUEST);
                }
                const otp = lib_1.default.otpGenNumber(6);
                const hashed_otp = yield lib_1.default.hashValue(otp);
                try {
                    const send_email = email
                        ? lib_1.default.sendEmailDefault({
                            email,
                            emailSub: constants_1.OTP_EMAIL_SUBJECT,
                            emailBody: (0, sendEmailOtpTemplate_1.sendEmailOtpTemplate)(otp, OTP_FOR),
                        })
                        : undefined;
                    if (send_email) {
                        yield CommonModel.insertOTP({
                            hashed_otp: hashed_otp,
                            email: email,
                            type: type,
                        });
                        return {
                            success: true,
                            code: this.StatusCode.HTTP_OK,
                            message: this.ResMsg.OTP_SENT,
                            data: {
                                email,
                            },
                        };
                    }
                    else {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                            message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                        };
                    }
                }
                catch (error) {
                    console.error("Error sending email or SMS:", error);
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                    };
                }
            }));
        });
    }
    //match email otp service
    matchEmailOtpService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { email, otp, type } = req.body;
                const CommonModel = this.Model.CommonModel(trx);
                const userModel = this.Model.UserModel(trx);
                const checkOtp = yield CommonModel.getOTP({
                    email,
                    type,
                    interval: "15",
                });
                if (!checkOtp.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_FORBIDDEN,
                        message: this.ResMsg.OTP_EXPIRED,
                    };
                }
                const { id: email_otp_id, hashed_otp, tried } = checkOtp[0];
                if (tried > 3) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_GONE,
                        message: this.ResMsg.TOO_MUCH_ATTEMPT,
                    };
                }
                const otpValidation = yield lib_1.default.compareHashValue(otp.toString(), hashed_otp);
                if (!otpValidation) {
                    yield CommonModel.updateOTP({
                        tried: tried + 1,
                    }, { id: email_otp_id });
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_UNAUTHORIZED,
                        message: this.ResMsg.OTP_INVALID,
                    };
                }
                yield CommonModel.updateOTP({
                    tried: tried + 1,
                    matched: 1,
                }, { id: email_otp_id });
                let secret = "";
                switch (type) {
                    // management
                    case constants_1.OTP_TYPES.reset_management: {
                        const management_details = yield userModel.getSingleCommonAuthUser({
                            email,
                            schema_name: "management",
                            table_name: constants_1.USER_AUTHENTICATION_VIEW.MANAGEMENT,
                        });
                        if (!management_details) {
                            throw new customError_1.default(this.ResMsg.NOT_FOUND_USER_WITH_EMAIL, this.StatusCode.HTTP_NOT_FOUND);
                        }
                        secret = config_1.default.JWT_SECRET_MANAGEMENT;
                        break;
                    }
                    case constants_1.OTP_TYPES.verify_management: {
                        const checkUser = yield userModel.getSingleCommonAuthUser({
                            schema_name: "management",
                            table_name: constants_1.USER_AUTHENTICATION_VIEW.MANAGEMENT,
                            email,
                        });
                        if (!checkUser) {
                            return {
                                success: false,
                                code: this.StatusCode.HTTP_BAD_REQUEST,
                                message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                            };
                        }
                        const { password_hash } = checkUser, rest = __rest(checkUser, ["password_hash"]);
                        const token_data = {
                            user_id: rest.user_id,
                            login_id: rest.login_id,
                            name: rest.name,
                            phone: rest.phone,
                            photo: rest.photo,
                            status: rest.status,
                            email: rest.email,
                        };
                        const token = lib_1.default.createToken(token_data, config_1.default.JWT_SECRET_MANAGEMENT, constants_1.LOGIN_TOKEN_EXPIRES_IN);
                        return {
                            success: true,
                            code: this.StatusCode.HTTP_OK,
                            message: this.ResMsg.LOGIN_SUCCESSFUL,
                            data: rest,
                            token,
                        };
                    }
                    // // AGENT
                    // case OTP_TYPES.reset_agent: {
                    //   const agent_details = await userModel.getSingleCommonAuthUser({
                    //     email,
                    //     schema_name: "agent",
                    //     table_name: USER_AUTHENTICATION_VIEW.AGENT,
                    //   });
                    //   if (!agent_details) {
                    //     throw new CustomError(
                    //       this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                    //       this.StatusCode.HTTP_NOT_FOUND
                    //     );
                    //   }
                    //   secret = config.JWT_SECRET_AGENT;
                    //   break;
                    // }
                    // case OTP_TYPES.verify_agent: {
                    //   const checkAgent =
                    //     await userModel.getSingleCommonAuthUser<IAgentAuthView>({
                    //       schema_name: "agent",
                    //       table_name: USER_AUTHENTICATION_VIEW.AGENT,
                    //       email,
                    //     });
                    //   if (!checkAgent) {
                    //     return {
                    //       success: false,
                    //       code: this.StatusCode.HTTP_BAD_REQUEST,
                    //       message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                    //     };
                    //   }
                    //   const { password_hash, ...rest } = checkAgent;
                    //   const token_data = {
                    //     user_id: rest.user_id,
                    //     login_id: rest.login_id,
                    //     name: rest.name,
                    //     phone: rest.phone,
                    //     photo: rest.photo,
                    //     account_status: rest.account_status,
                    //     email: rest.email,
                    //   };
                    //   const token = Lib.createToken(
                    //     token_data,
                    //     config.JWT_SECRET_AGENT,
                    //     LOGIN_TOKEN_EXPIRES_IN
                    //   );
                    //   return {
                    //     success: true,
                    //     code: this.StatusCode.HTTP_OK,
                    //     message: this.ResMsg.LOGIN_SUCCESSFUL,
                    //     data: rest,
                    //     token,
                    //   };
                    // }
                    // // SUPPLIER
                    // case OTP_TYPES.reset_supplier: {
                    //   const supplier_details =
                    //     await userModel.getSingleCommonAuthUser<ISupplierAuthView>({
                    //       email,
                    //       schema_name: "supplier",
                    //       table_name: USER_AUTHENTICATION_VIEW.SUPPLIER,
                    //     });
                    //   if (!supplier_details) {
                    //     throw new CustomError(
                    //       this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                    //       this.StatusCode.HTTP_NOT_FOUND
                    //     );
                    //   }
                    //   secret = config.JWT_SECRET_SUPPLIER;
                    //   break;
                    // }
                    // case OTP_TYPES.verify_supplier: {
                    //   const checkSupplier =
                    //     await userModel.getSingleCommonAuthUser<ISupplierAuthView>({
                    //       schema_name: "supplier",
                    //       table_name: USER_AUTHENTICATION_VIEW.SUPPLIER,
                    //       email,
                    //     });
                    //   if (!checkSupplier) {
                    //     return {
                    //       success: false,
                    //       code: this.StatusCode.HTTP_BAD_REQUEST,
                    //       message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                    //     };
                    //   }
                    //   const { password_hash, ...rest } = checkSupplier;
                    //   const token_data = {
                    //     user_id: rest.user_id,
                    //     login_id: rest.login_id,
                    //     name: rest.name,
                    //     phone: rest.phone,
                    //     photo: rest.photo,
                    //     account_status: rest.account_status,
                    //     email: rest.email,
                    //   };
                    //   const token = Lib.createToken(
                    //     token_data,
                    //     config.JWT_SECRET_SUPPLIER,
                    //     LOGIN_TOKEN_EXPIRES_IN
                    //   );
                    //   return {
                    //     success: true,
                    //     code: this.StatusCode.HTTP_OK,
                    //     message: this.ResMsg.LOGIN_SUCCESSFUL,
                    //     data: rest,
                    //     token,
                    //   };
                    // }
                    // // B2C
                    // case OTP_TYPES.reset_b2c: {
                    //   const b2c_details = await userModel.getSingleCommonAuthUser({
                    //     email,
                    //     schema_name: "b2c",
                    //     table_name: USER_AUTHENTICATION_VIEW.B2C,
                    //   });
                    //   if (!b2c_details) {
                    //     throw new CustomError(
                    //       this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                    //       this.StatusCode.HTTP_NOT_FOUND
                    //     );
                    //   }
                    //   secret = config.JWT_SECRET_B2C;
                    //   break;
                    // }
                    // case OTP_TYPES.verify_b2c: {
                    //   const checkB2C =
                    //     await userModel.getSingleCommonAuthUser<IB2cAuthView>({
                    //       schema_name: "b2c",
                    //       table_name: USER_AUTHENTICATION_VIEW.B2C,
                    //       email,
                    //     });
                    //   if (!checkB2C) {
                    //     return {
                    //       success: false,
                    //       code: this.StatusCode.HTTP_BAD_REQUEST,
                    //       message: this.ResMsg.NOT_FOUND_USER_WITH_EMAIL,
                    //     };
                    //   }
                    //   const { password_hash, ...rest } = checkB2C;
                    //   const token_data = {
                    //     user_id: rest.user_id,
                    //     email: rest.email,
                    //     login_id: rest.login_id,
                    //     name: rest.name,
                    //     phone: rest.phone,
                    //     photo: rest.photo,
                    //     account_status: rest.account_status,
                    //   };
                    //   const token = Lib.createToken(
                    //     token_data,
                    //     config.JWT_SECRET_B2C,
                    //     LOGIN_TOKEN_EXPIRES_IN
                    //   );
                    //   return {
                    //     success: true,
                    //     code: this.StatusCode.HTTP_OK,
                    //     message: this.ResMsg.LOGIN_SUCCESSFUL,
                    //     data: rest,
                    //     token,
                    //   };
                    // }
                    // case OTP_TYPES.register_b2c:
                    //   const check_b2c = await userModel.getSingleCommonAuthUser({
                    //     email,
                    //     schema_name: "b2c",
                    //     table_name: USER_AUTHENTICATION_VIEW.B2C,
                    //   });
                    //   if (check_b2c) {
                    //     throw new CustomError(
                    //       this.ResMsg.EMAIL_ALREADY_EXISTS,
                    //       this.StatusCode.HTTP_CONFLICT
                    //     );
                    //   }
                    //   secret = config.JWT_SECRET_B2C;
                    //   break;
                    default:
                        throw new customError_1.default("Invalid OTP type", this.StatusCode.HTTP_BAD_REQUEST);
                }
                const token = lib_1.default.createToken({
                    email: email,
                    type: type,
                }, secret, "15m");
                return {
                    success: true,
                    code: this.StatusCode.HTTP_ACCEPTED,
                    message: this.ResMsg.OTP_MATCHED,
                    type,
                    token,
                };
            }));
        });
    }
    addDeviceToken(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = yield this.commonAuthChecker(req);
            const { device_token } = req.body;
            const model = this.Model.CommonModel();
            yield model.upsertMobileToken({ token: device_token, user_id });
            return {
                success: true,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                code: this.StatusCode.HTTP_SUCCESSFUL,
            };
        });
    }
    removeDeviceToken(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = yield this.commonAuthChecker(req);
            const model = this.Model.CommonModel();
            yield model.deleteMobileToken({ user_id });
            return {
                success: true,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                code: this.StatusCode.HTTP_SUCCESSFUL,
            };
        });
    }
    getAllNotification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = yield this.commonAuthChecker(req);
            const model = this.Model.CommonModel();
            const data = yield model.getNotification(Object.assign(Object.assign({}, req.query), { user_id }));
            return Object.assign({ success: true, message: this.ResMsg.HTTP_OK, code: this.StatusCode.HTTP_OK }, data);
        });
    }
    deleteNotification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = yield this.commonAuthChecker(req);
            const { id } = req.query;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.CommonModel(trx);
                const getMyNotification = yield model.getNotification({
                    id: Number(id),
                    user_id,
                    limit: "1",
                    need_total: false,
                });
                if (!getMyNotification.data.length) {
                    return {
                        success: false,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                    };
                }
                if (getMyNotification.data[0].user_type.toLowerCase() ===
                    constants_1.USER_TYPE.MANAGEMENT.toLowerCase()) {
                    yield this.insertInstituteAudit(trx, {
                        details: id
                            ? `Notification ${id} has been deleted`
                            : "All Notification has been deleted.",
                        created_by: user_id,
                        endpoint: req.originalUrl,
                        type: "delete",
                        institute_id,
                    });
                }
                if (id) {
                    yield model.deleteNotification({
                        notification_id: Number(id),
                        user_id,
                    });
                }
                else {
                    const getAllNotification = yield model.getNotification({
                        user_id,
                        limit: "1000",
                        need_total: false,
                    });
                    const payload = getAllNotification.data
                        .filter((notification) => Number.isInteger(notification.id))
                        .map((notification) => ({
                        notification_id: notification.id,
                        user_id,
                    }));
                    if (payload.length) {
                        yield model.deleteNotification(payload);
                    }
                }
                return {
                    success: true,
                    message: this.ResMsg.HTTP_OK,
                    code: this.StatusCode.HTTP_OK,
                };
            }));
        });
    }
    readNotification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = yield this.commonAuthChecker(req);
            const { id } = req.query;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const model = this.Model.CommonModel(trx);
                if (id) {
                    const getMyNotification = yield model.getNotification({
                        id: Number(id),
                        user_id,
                        read_status: false,
                        limit: "1",
                        need_total: false,
                    });
                    if (!getMyNotification.data.length) {
                        return {
                            success: false,
                            message: "No unread notification found",
                            code: this.StatusCode.HTTP_NOT_FOUND,
                        };
                    }
                    if (getMyNotification.data[0].user_type.toLowerCase() ===
                        constants_1.USER_TYPE.INSTITUTE.toLowerCase()) {
                        yield this.insertInstituteAudit(trx, {
                            details: `Notification ${id} has been read`,
                            created_by: user_id,
                            endpoint: req.originalUrl,
                            institute_id,
                            type: "update",
                        });
                    }
                    yield model.readNotification({
                        notification_id: Number(id),
                        user_id,
                    });
                }
                else {
                    const getAllNotification = yield model.getNotification({
                        user_id,
                        read_status: false,
                        limit: "1000",
                        need_total: false,
                    });
                    if (!getAllNotification.data.length) {
                        return {
                            success: false,
                            message: "No unread notification found",
                            code: this.StatusCode.HTTP_NOT_FOUND,
                        };
                    }
                    const unreadNotifications = [];
                    for (const notification of getAllNotification.data) {
                        if (!Number.isInteger(notification.id))
                            continue;
                        const isAlreadyRead = yield model.getReadNotification({
                            user_id,
                            notification_id: notification.id,
                        });
                        if (!isAlreadyRead) {
                            unreadNotifications.push({
                                notification_id: notification.id,
                                user_id,
                            });
                        }
                        const isInstitute = ((_a = notification === null || notification === void 0 ? void 0 : notification.user_type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) ===
                            constants_1.USER_TYPE.INSTITUTE.toLowerCase();
                        if (isInstitute) {
                            yield this.insertInstituteAudit(trx, {
                                details: "All notifications have been read.",
                                created_by: user_id,
                                endpoint: req.originalUrl,
                                type: "update",
                                institute_id,
                            });
                        }
                    }
                    if (unreadNotifications.length) {
                        yield model.readNotification(unreadNotifications);
                    }
                }
                return {
                    success: true,
                    message: this.ResMsg.HTTP_OK,
                    code: this.StatusCode.HTTP_OK,
                };
            }));
        });
    }
}
exports.default = PublicService;
