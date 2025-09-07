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
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const config_1 = __importDefault(require("../../../app/config"));
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
const constants_1 = require("../../../utils/miscellaneous/constants");
const sendEmailOtpTemplate_1 = require("../../../utils/templates/sendEmailOtpTemplate");
class StudentAuthService extends abstract_service_1.default {
    //login
    loginService(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login_id, password } = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const userModel = this.Model.UserModel(trx);
                const CommonModel = this.Model.CommonModel(trx);
                const checkUser = yield userModel.getSingleCommonAuthUser({
                    schema_name: "student",
                    table_name: constants_1.USER_AUTHENTICATION_VIEW.STUDENT,
                    login_id: login_id,
                });
                console.log({ checkUser });
                if (!checkUser) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.WRONG_CREDENTIALS,
                    };
                }
                const { password_hash: hashPass } = checkUser, rest = __rest(checkUser, ["password_hash"]);
                const checkPass = yield lib_1.default.compareHashValue(password, hashPass);
                if (!checkPass) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.WRONG_CREDENTIALS,
                    };
                }
                if (rest.status === constants_1.USER_STATUS.BLOCKED) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_FORBIDDEN,
                        message: "Account Blocked: Your account status is 'Blocked'",
                    };
                }
                if (rest.status !== constants_1.USER_STATUS.ACTIVE) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_FORBIDDEN,
                        message: `Account Inactive: Your account status is 'Inactive'.`,
                    };
                }
                if (rest.is_2fa_on) {
                    const checkOtp = yield CommonModel.getOTP({
                        email: checkUser.email,
                        type: constants_1.OTP_TYPES.verify_student,
                        interval: "1",
                    });
                    if (checkOtp.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_GONE,
                            message: this.ResMsg.THREE_TIMES_EXPIRED,
                        };
                    }
                    const generateOtp = lib_1.default.otpGenNumber(6);
                    const hashed_otp = yield lib_1.default.hashValue(generateOtp);
                    const insertOtp = yield CommonModel.insertOTP({
                        email: checkUser.email,
                        type: constants_1.OTP_TYPES.verify_student,
                        hashed_otp,
                    });
                    if (!insertOtp) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                            message: "Cannot send email at the moment ",
                        };
                    }
                    yield lib_1.default.sendEmailDefault({
                        email: checkUser.email,
                        emailSub: "2FA Verification",
                        emailBody: (0, sendEmailOtpTemplate_1.sendEmailOtpTemplate)(generateOtp, "2FA verification"),
                    });
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: this.ResMsg.TWO_FA_CODE_SEND,
                        data: {
                            email: checkUser.email,
                            is_2fa_on: true,
                        },
                    };
                }
                else {
                    const token_data = {
                        user_id: rest.user_id,
                        login_id: rest.login_id,
                        institute_id: rest.institute_id,
                        name: rest.name,
                        phone: rest.phone,
                        photo: rest.photo,
                        status: rest.status,
                        email: checkUser.email,
                    };
                    const token = lib_1.default.createToken(token_data, config_1.default.JWT_SECRET_STUDENT, constants_1.LOGIN_TOKEN_EXPIRES_IN);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: this.ResMsg.LOGIN_SUCCESSFUL,
                        data: rest,
                        token,
                    };
                }
            }));
        });
    }
    //forget pass
    forgetPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, email, password } = req.body;
            const token_verify = lib_1.default.verifyToken(token, config_1.default.JWT_SECRET_STUDENT);
            if (!token_verify) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: this.ResMsg.HTTP_UNAUTHORIZED,
                };
            }
            const { email: verify_email } = token_verify;
            if (email === verify_email) {
                const hashed_pass = yield lib_1.default.hashValue(password);
                const model = this.Model.UserModel();
                const get_user = yield model.checkUser({
                    email,
                    type: constants_1.USER_TYPE.STUDENT,
                });
                yield model.updateProfile({ password_hash: hashed_pass }, get_user.id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.PASSWORD_CHANGED,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_FORBIDDEN,
                    message: this.StatusCode.HTTP_FORBIDDEN,
                };
            }
        });
    }
}
exports.default = StudentAuthService;
