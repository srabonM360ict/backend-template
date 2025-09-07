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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
const constants_1 = require("../../../utils/miscellaneous/constants");
const welcomeEmailTemplate_1 = require("../../../utils/templates/welcomeEmailTemplate");
class ManagementInstituteService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Institute Registration
    instituteRegistration(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.management;
            const { institute, instituteHead } = req.body;
            const files = req.files;
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const managementModel = this.Model.ManagementModel(trx);
                const userModel = this.Model.UserModel(trx);
                const instituteModel = this.Model.InstituteModel(trx);
                const profile = yield managementModel.getSingleManagement({
                    id: user_id,
                });
                if (!profile) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                let institute_logo = null;
                let instituteHead_photo = null;
                if (files !== undefined) {
                    if (Array.isArray(files)) {
                        for (const { fieldname, filename } of files) {
                            switch (fieldname) {
                                case "institute_logo":
                                    institute_logo = filename;
                                    break;
                                case "institute_head_photo":
                                    instituteHead_photo = filename;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
                const { institution_code, name: ins_name, email: ins_email, phone: ins_phone, website, } = institute;
                const { name, email, password, phone, gender, blood_group, nid } = instituteHead;
                const fieldsToCheckInstitute = [
                    {
                        key: "institution_code",
                        value: institution_code,
                        message: "Institute with this code already exists",
                    },
                    {
                        key: "name",
                        value: ins_name,
                        message: "Institute with this name already exists",
                    },
                    {
                        key: "email",
                        value: ins_email,
                        message: "Institute with this email already exists",
                    },
                    {
                        key: "phone",
                        value: ins_phone,
                        message: "Institute with this phone already exists",
                    },
                    {
                        key: "website",
                        value: website,
                        message: "Institute with this website url already exists",
                    },
                ];
                for (const field of fieldsToCheckInstitute) {
                    if (!field.value)
                        continue;
                    const exists = yield instituteModel.getSingleInstitute({
                        [field.key]: field.value,
                    });
                    if (exists) {
                        throw new customError_1.default(field.message, this.StatusCode.HTTP_CONFLICT);
                    }
                }
                const password_hash = yield lib_1.default.hashValue(password);
                const code = yield lib_1.default.generateLoginIdForTeacher({
                    institute_code: institution_code,
                    userType: constants_1.USER_TYPE.INSTITUTE,
                    schema: "dbo",
                    db: this.db,
                });
                const login_id = code.split(".").join("");
                const newUser = {
                    login_id,
                    code,
                    name,
                    password_hash,
                    email,
                    phone,
                    photo: instituteHead_photo,
                    user_type: constants_1.USER_TYPE.INSTITUTE,
                };
                const createdNewUser = yield userModel.createUser(newUser);
                const newInstitute = Object.assign({ logo: institute_logo, created_by: user_id }, institute);
                const createdNewInstitute = yield instituteModel.createInstitute(newInstitute);
                const newInstituteUser = {
                    user_id: createdNewUser[0].id,
                    institute_id: createdNewInstitute[0].id,
                    nid,
                    blood_group,
                    gender,
                    is_main: true,
                    created_by: user_id,
                };
                yield instituteModel.createInstituteUser(newInstituteUser);
                yield lib_1.default.sendEmailDefault({
                    email,
                    emailBody: (0, welcomeEmailTemplate_1.welcomeCompletedTemplate)(name, {
                        login_id: login_id || email,
                        password,
                    }, constants_1.USER_TYPE.MANAGEMENT),
                    emailSub: "Welcome To BPI Saas Software.",
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    // Get All Institutes
    getAllInstitute(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { institution_code, name, email, phone, limit, skip } = req.query;
            const instituteModel = this.Model.InstituteModel();
            const data = yield instituteModel.getAllInstitute({
                institution_code: institution_code,
                name: name,
                email: email,
                phone: phone,
                limit: Number(limit),
                skip: Number(skip),
            });
            return Object.assign({ success: true, code: this.StatusCode.HTTP_OK, message: this.ResMsg.HTTP_OK }, data);
        });
    }
    // Get Single Institute
    getSingleInstitute(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const instituteModel = this.Model.InstituteModel();
            const data = yield instituteModel.getSingleInstitute({
                id: Number(id),
            });
            if (!data) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: `The requested institute not found with ID ${id}`,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
            };
        });
    }
    // Update Institute
    updateInstitute(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.management;
            const { id } = req.params;
            const { institute = {} } = req.body;
            const files = req.files;
            if ((!req.body || Object.keys(req.body).length === 0) &&
                (!req.files || Object.keys(req.files).length === 0)) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: "No data provided to update.",
                };
            }
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const instituteModel = this.Model.InstituteModel(trx);
                const managementModel = this.Model.ManagementModel(trx);
                const profile = yield managementModel.getSingleManagement({
                    id: user_id,
                });
                if (!profile) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const data = yield instituteModel.getSingleInstitute({
                    id: Number(id),
                });
                if (!data) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: `The requested institute not found with ID ${id}`,
                    };
                }
                const instituteUser = yield instituteModel.getSingleInstituteUser({
                    institute_id: data.id,
                });
                if (!instituteUser) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: `The requested institute head not found with Institute ID ${id}`,
                    };
                }
                let institute_logo = data.institute_logo;
                // handle uploaded files safely
                if (files) {
                    const fileArray = Array.isArray(files)
                        ? files
                        : Object.values(files).flat();
                    for (const file of fileArray) {
                        const { fieldname, filename } = file;
                        if (fieldname === "institute_logo")
                            institute_logo = filename;
                    }
                }
                const { institution_code, name, email, phone, website } = institute;
                // check uniqueness but skip current institute itself
                const fieldsToCheckInstitute = [
                    {
                        key: "institution_code",
                        value: institution_code,
                        message: "Institute with this code already exists",
                    },
                    {
                        key: "name",
                        value: name,
                        message: "Institute with this name already exists",
                    },
                    {
                        key: "email",
                        value: email,
                        message: "Institute with this email already exists",
                    },
                    {
                        key: "phone",
                        value: phone,
                        message: "Institute with this phone already exists",
                    },
                    {
                        key: "website",
                        value: website,
                        message: "Institute with this website url already exists",
                    },
                ];
                for (const field of fieldsToCheckInstitute) {
                    if (!field.value)
                        continue;
                    const exists = yield instituteModel.getSingleInstitute({
                        [field.key]: field.value,
                    });
                    if (exists && exists.id !== data.id) {
                        throw new customError_1.default(field.message, this.StatusCode.HTTP_CONFLICT);
                    }
                }
                const updateInstitute = Object.assign({ logo: institute_logo, updated_by: user_id }, institute);
                yield instituteModel.updateInstitute(updateInstitute, {
                    id: Number(id),
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
}
exports.default = ManagementInstituteService;
