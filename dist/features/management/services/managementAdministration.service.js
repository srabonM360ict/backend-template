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
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
const constants_1 = require("../../../utils/miscellaneous/constants");
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const welcomeEmailTemplate_1 = require("../../../utils/templates/welcomeEmailTemplate");
class ManagementAdministrationService extends abstract_service_1.default {
    // create role
    createRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { user_id } = req.management;
                const model = this.Model.ManagementAdministrationModel(trx);
                const { role_name, permissions } = req.body;
                const check_name = yield model.getSingleRole({ name: role_name });
                if (check_name.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: `Role already exists with this name`,
                    };
                }
                const role_res = yield model.createRole({
                    name: role_name,
                    created_by: user_id,
                });
                const uniquePermission = [];
                for (let i = 0; i < permissions.length; i++) {
                    let found = false;
                    for (let j = 0; j < uniquePermission.length; j++) {
                        if (permissions[i].permission_id == uniquePermission[j].permission_id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        uniquePermission.push(permissions[i]);
                    }
                }
                if (uniquePermission.length) {
                    const permission_body = uniquePermission.map((element) => {
                        return {
                            role_id: role_res[0].id,
                            permission_id: element.permission_id,
                            read: element.read,
                            write: element.write,
                            update: element.update,
                            delete: element.delete,
                            created_by: user_id,
                        };
                    });
                    yield model.createRolePermission(permission_body);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    //role list
    roleList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const model = this.Model.ManagementAdministrationModel();
            const role_list = yield model.roleList(Number(limit), Number(skip), true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: role_list.total,
                data: role_list.data,
            };
        });
    }
    //create permission
    createPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.management;
            const model = this.Model.ManagementAdministrationModel();
            const check_name = yield model.permissionsList({
                name: req.body.permission_name,
            });
            if (check_name.data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.PERMISSION_NAME_EXIST,
                };
            }
            const create_permission = yield model.createPermission({
                name: req.body.permission_name,
                created_by: user_id,
            });
            if (create_permission.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                    message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                };
            }
        });
    }
    //permission list
    permissionList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const model = this.Model.ManagementAdministrationModel();
            const permission_list = yield model.permissionsList({
                limit: Number(limit),
                skip: Number(skip),
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: permission_list.total,
                data: permission_list.data,
            };
        });
    }
    //get single role permission
    getSingleRolePermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const role_id = req.params.id;
            const model = this.Model.ManagementAdministrationModel();
            const role_permission = yield model.getSingleRole({
                id: parseInt(role_id),
            });
            if (!role_permission.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: role_permission[0],
            };
        });
    }
    //update role permission
    updateRolePermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { user_id } = req.management;
                const model = this.Model.ManagementAdministrationModel(trx);
                const { id: role_id } = req.params;
                const check_role = yield model.getSingleRole({
                    id: Number(role_id),
                });
                if (!check_role.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                if (check_role[0].is_main_role) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
                        message: "You can't update main role",
                    };
                }
                const { add_permissions, role_name, status } = req.body;
                if (role_name || status) {
                    const check_name = yield model.getSingleRole({
                        name: role_name,
                    });
                    if (!check_name.length) {
                        yield model.updateRole({ name: role_name, status }, Number(role_id));
                    }
                }
                if (add_permissions) {
                    const { data: getAllPermission } = yield model.permissionsList({});
                    const add_permissionsValidation = [];
                    for (let i = 0; i < add_permissions.length; i++) {
                        for (let j = 0; j < (getAllPermission === null || getAllPermission === void 0 ? void 0 : getAllPermission.length); j++) {
                            if (add_permissions[i].permission_id ==
                                getAllPermission[j].permission_id) {
                                add_permissionsValidation.push(add_permissions[i]);
                            }
                        }
                    }
                    // get single role permission
                    const { permissions } = check_role[0];
                    const insertPermissionVal = [];
                    const haveToUpdateVal = [];
                    for (let i = 0; i < add_permissionsValidation.length; i++) {
                        let found = false;
                        for (let j = 0; j < permissions.length; j++) {
                            if (add_permissionsValidation[i].permission_id ==
                                permissions[j].permission_id) {
                                found = true;
                                haveToUpdateVal.push(add_permissionsValidation[i]);
                                break;
                            }
                        }
                        if (!found) {
                            insertPermissionVal.push(add_permissions[i]);
                        }
                    }
                    // insert permission
                    const add_permission_body = insertPermissionVal.map((element) => {
                        return {
                            role_id,
                            permission_id: element.permission_id,
                            read: element.read,
                            write: element.write,
                            update: element.update,
                            delete: element.delete,
                            created_by: user_id,
                        };
                    });
                    if (add_permission_body.length) {
                        yield model.createRolePermission(add_permission_body);
                    }
                    // update section
                    if (haveToUpdateVal.length) {
                        const update_permission_res = haveToUpdateVal.map((element) => __awaiter(this, void 0, void 0, function* () {
                            yield model.updateRolePermission({
                                read: element.read,
                                update: element.update,
                                write: element.write,
                                delete: element.delete,
                                updated_by: user_id,
                            }, element.permission_id, parseInt(role_id));
                        }));
                        yield Promise.all(update_permission_res);
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
    createManagement(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.management;
            const files = req.files || [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            const _a = req.body, { password, email, phone, login_id: code } = _a, rest = __rest(_a, ["password", "email", "phone", "login_id"]);
            const model = this.Model.UserModel();
            const managementModel = this.Model.ManagementModel();
            //check managements email and phone number
            const check_management = yield model.checkUser({
                email,
                type: constants_1.USER_TYPE.MANAGEMENT,
            });
            if (check_management) {
                if (check_management.email === email) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.EMAIL_ALREADY_EXISTS,
                    };
                }
            }
            if (code) {
                const checkLoginId = yield model.checkUser({
                    code,
                    type: constants_1.USER_TYPE.MANAGEMENT,
                });
                if (checkLoginId) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Login ID already exists!",
                    };
                }
            }
            const login_id = code.split(".").join("");
            rest.user_type = constants_1.USER_TYPE.MANAGEMENT;
            //password hashing
            const hashedPass = yield lib_1.default.hashValue(password);
            //create user
            const management_res = yield model.createUser(Object.assign({ password_hash: hashedPass, email,
                phone,
                login_id,
                code }, rest));
            yield managementModel.createManagement({
                user_id: management_res[0].id,
                created_by: user_id,
            });
            yield lib_1.default.sendEmailDefault({
                email,
                emailBody: (0, welcomeEmailTemplate_1.welcomeCompletedTemplate)(rest.name, {
                    login_id: login_id || email,
                    password,
                }, constants_1.USER_TYPE.MANAGEMENT),
                emailSub: "Welcome To BPI Saas Software.",
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    //get all management
    getAllManagement(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.ManagementModel();
            const data = yield model.getAllManagement(req.query, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    //get single management
    getSingleManagement(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const model = this.Model.ManagementModel();
            const management = yield model.getSingleManagement({ id });
            if (!management) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const { password_hash } = management, cleanedData = __rest(management, ["password_hash"]);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: cleanedData,
            };
        });
    }
    //update management
    updateManagement(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const { is_main } = req.management;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const managementModel = this.Model.ManagementModel(trx);
                const UserModel = this.Model.UserModel(trx);
                const files = req.files || [];
                // Attach file to request body if uploaded
                if (files.length) {
                    req.body[files[0].fieldname] = files[0].filename;
                }
                const management = yield managementModel.getSingleManagement({
                    id,
                });
                if (!management) {
                    throw new customError_1.default(this.ResMsg.HTTP_NOT_FOUND, this.StatusCode.HTTP_NOT_FOUND);
                }
                if ((management === null || management === void 0 ? void 0 : management.is_main) && !is_main) {
                    throw new customError_1.default("You can't update this management because it is the main management", this.StatusCode.HTTP_BAD_REQUEST);
                }
                // Check for unique login_id
                if (req.body.login_id) {
                    const existingUser = yield managementModel.getSingleManagement({
                        login_id: req.body.login_id,
                    });
                    if (existingUser && existingUser.user_id !== id) {
                        throw new customError_1.default(this.ResMsg.login_id_ALREADY_EXISTS, this.StatusCode.HTTP_CONFLICT);
                    }
                }
                // Check for unique phone number
                if (req.body.phone) {
                    const existingPhone = yield managementModel.getSingleManagement({
                        phone: req.body.phone,
                    });
                    if (existingPhone && existingPhone.user_id !== id) {
                        throw new customError_1.default(this.ResMsg.phone_ALREADY_EXISTS, this.StatusCode.HTTP_CONFLICT);
                    }
                }
                const _a = req.body, { role_id, is_2fa_on } = _a, rest = __rest(_a, ["role_id", "is_2fa_on"]);
                if (Object.keys(rest).length) {
                    yield UserModel.updateProfile(rest, id);
                }
                if (role_id !== undefined || is_2fa_on !== undefined) {
                    yield managementModel.updateManagement({ is_2fa_on }, { user_id: id });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: req.body,
                };
            }));
        });
    }
}
exports.default = ManagementAdministrationService;
