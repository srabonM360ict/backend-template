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
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
const constants_1 = require("../../../utils/miscellaneous/constants");
class InstituteProfileService extends abstract_service_1.default {
    // Get profile
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const instituteModel = this.Model.InstituteModel();
            const profile = yield instituteModel.getSingleInstituteUser({
                user_id,
                institute_id,
            });
            if (!profile) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const { password_hash } = profile, userData = __rest(profile, ["password_hash"]);
            const institute = yield instituteModel.getSingleInstitute({
                institute_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: Object.assign(Object.assign({}, userData), { institute }),
            };
        });
    }
    // Edit profile
    editProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.institute;
            const files = req.files;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const userModel = this.Model.UserModel(trx);
                const body = lib_1.default.safeParseJSON(req.body);
                const user = yield userModel.checkUser({ id: user_id });
                const deleteAbleFiles = [];
                if (files === null || files === void 0 ? void 0 : files.length) {
                    body["photo"] = files[0].filename;
                    if (user === null || user === void 0 ? void 0 : user.photo) {
                        deleteAbleFiles.push(user.photo);
                    }
                }
                const { is_2fa_on } = body, rest = __rest(body, ["is_2fa_on"]);
                if (rest.phone) {
                    const checkPhone = yield userModel.checkUser({
                        phone: rest.phone,
                        type: constants_1.USER_TYPE.INSTITUTE,
                    });
                    if (checkPhone) {
                        throw new customError_1.default(this.ResMsg.phone_ALREADY_EXISTS, this.StatusCode.HTTP_BAD_REQUEST);
                    }
                }
                if (rest.email) {
                    const checkEmail = yield userModel.checkUser({
                        email: rest.email,
                        type: constants_1.USER_TYPE.INSTITUTE,
                    });
                    if (checkEmail) {
                        throw new customError_1.default(this.ResMsg.EMAIL_ALREADY_EXISTS, this.StatusCode.HTTP_BAD_REQUEST);
                    }
                }
                if (rest.login_id) {
                    const checkLoginId = yield userModel.checkUser({
                        login_id: rest.login_id,
                        type: constants_1.USER_TYPE.INSTITUTE,
                    });
                    if (checkLoginId) {
                        throw new customError_1.default(this.ResMsg.LOGIN_ID_ALREADY_EXISTS, this.StatusCode.HTTP_BAD_REQUEST);
                    }
                }
                // if (is_2fa_on !== undefined) {
                //   await instituteModel.updateInstitute({ is_2fa_on }, { user_id });
                //   // await this.insertinstituteAudit(trx, {
                //   //   details: `institute User(${user_id}) has updated 2FA settings to ${is_2fa_on}.`,
                //   //   endpoint: `${req.method} ${req.originalUrl}`,
                //   //   created_by: user_id,
                //   //   type: "UPDATE",
                //   // });
                // }
                if (Object.keys(rest).length) {
                    const updateResult = yield userModel.updateProfile(rest, user_id);
                    if (deleteAbleFiles.length && updateResult) {
                        yield this.manageFile.deleteFromCloud(deleteAbleFiles);
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    // Change password
    changePassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.institute;
            const { old_password, new_password } = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const instituteModel = this.Model.InstituteModel(trx);
                const userModel = this.Model.UserModel(trx);
                const institute = yield instituteModel.getSingleInstituteUser({
                    user_id,
                    institute_id,
                });
                if (!institute) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const isOldPasswordValid = yield lib_1.default.compareHashValue(old_password, institute.password_hash);
                if (!isOldPasswordValid) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.PASSWORDS_DO_NOT_MATCH,
                    };
                }
                const password_hash = yield lib_1.default.hashValue(new_password);
                const result = yield userModel.updateProfile({ password_hash }, user_id);
                // await this.insertinstituteAudit(trx, {
                //   details: `institute User ${institute.login_id}(${user_id}) has changed their own password.`,
                //   endpoint: req.originalUrl,
                //   created_by: user_id,
                //   type: "UPDATE",
                // });
                return {
                    success: !!result,
                    code: result
                        ? this.StatusCode.HTTP_OK
                        : this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                    message: result
                        ? this.ResMsg.PASSWORD_CHANGED
                        : this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                };
            }));
        });
    }
}
exports.default = InstituteProfileService;
