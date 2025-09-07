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
class StudentProfileService extends abstract_service_1.default {
    // Get profile
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, institute_id } = req.student;
            const studentModel = this.Model.StudentModel();
            const profile = yield studentModel.getSingleStudent({
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
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: Object.assign({}, userData),
            };
        });
    }
    // Edit profile
    editProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.student;
            const files = req.files;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const userModel = this.Model.UserModel(trx);
                const studentModel = this.Model.StudentModel(trx);
                const body = lib_1.default.safeParseJSON(req.body);
                const user = yield userModel.checkUser({ id: user_id });
                const { is_2fa_on, phone, email, photo, name } = body, rest = __rest(body, ["is_2fa_on", "phone", "email", "photo", "name"]);
                const userProfile = {};
                const deleteAbleFiles = [];
                if (files === null || files === void 0 ? void 0 : files.length) {
                    userProfile.photo = files[0].filename;
                    if (user === null || user === void 0 ? void 0 : user.photo) {
                        deleteAbleFiles.push(user.photo);
                    }
                }
                if (phone) {
                    const checkPhone = yield userModel.checkUser({
                        phone: phone,
                        type: constants_1.USER_TYPE.STUDENT,
                    });
                    if (checkPhone) {
                        throw new customError_1.default(this.ResMsg.phone_ALREADY_EXISTS, this.StatusCode.HTTP_BAD_REQUEST);
                    }
                    userProfile.phone = phone;
                }
                if (email) {
                    const checkEmail = yield userModel.checkUser({
                        email: email,
                        type: constants_1.USER_TYPE.STUDENT,
                    });
                    if (checkEmail) {
                        throw new customError_1.default(this.ResMsg.EMAIL_ALREADY_EXISTS, this.StatusCode.HTTP_BAD_REQUEST);
                    }
                    userProfile.email = email;
                }
                if (name)
                    userProfile.name = name;
                if (is_2fa_on)
                    userProfile.is_2fa_on = is_2fa_on;
                if (Object.keys(userProfile).length) {
                    const updateResult = yield userModel.updateProfile(userProfile, user_id);
                    if (deleteAbleFiles.length && updateResult) {
                        yield this.manageFile.deleteFromCloud(deleteAbleFiles);
                    }
                }
                if (Object.keys(rest).length) {
                    yield studentModel.updateStudent(rest, user_id);
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
            const { user_id, institute_id } = req.student;
            const { old_password, new_password } = req.body;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const studentModel = this.Model.StudentModel(trx);
                const userModel = this.Model.UserModel(trx);
                const _a = yield studentModel.getSingleStudent({
                    user_id,
                    institute_id,
                }), { password_hash: old_hash_pass } = _a, student = __rest(_a, ["password_hash"]);
                if (!student || !old_hash_pass) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const isOldPasswordValid = yield lib_1.default.compareHashValue(old_password, old_hash_pass);
                if (!isOldPasswordValid) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.PASSWORDS_DO_NOT_MATCH,
                    };
                }
                const password_hash = yield lib_1.default.hashValue(new_password);
                const result = yield userModel.updateProfile({ password_hash }, user_id);
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
exports.default = StudentProfileService;
