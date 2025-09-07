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
const abstract_controller_1 = __importDefault(require("../../../abstract/abstract.controller"));
const instituteStudentEnrollment_service_1 = __importDefault(require("../services/instituteStudentEnrollment.service"));
const instituteStudentEnrollment_validator_1 = require("../utils/validator/instituteStudentEnrollment.validator");
class InstituteStudentEnrollmentController extends abstract_controller_1.default {
    constructor() {
        super(...arguments);
        this.validator = new instituteStudentEnrollment_validator_1.InstituteStudentEnrollmentValidator();
        this.service = new instituteStudentEnrollment_service_1.default();
        this.createStudentEnrollment = this.asyncWrapper.wrap({ bodySchema: this.validator.createEnrollmentSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.createStudentEnrollment(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        this.getAllStudentEnrollment = this.asyncWrapper.wrap({ querySchema: this.validator.getEnrollmentQuerySchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.getStudentEnrollments(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        this.getSingleStudentEnrollment = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.getSingleStudentEnrollment(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        this.getStudentAttendanceSummary = this.asyncWrapper.wrap({ querySchema: this.validator.getAttendanceSummarySchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.getStudentAttendanceSummary(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        this.updateStudentEnrollment = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.validator.updateEnrollmentSchema,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.service.updateStudentEnrollment(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        this.deleteStudentEnrollment = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.service.deleteStudentEnrollment(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = InstituteStudentEnrollmentController;
