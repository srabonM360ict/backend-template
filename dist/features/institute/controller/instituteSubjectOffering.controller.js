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
const instituteSubjectOffering_service_1 = __importDefault(require("../services/instituteSubjectOffering.service"));
const instituteSubjectOffering_validator_1 = __importDefault(require("../utils/validator/instituteSubjectOffering.validator"));
class InstituteSubjectOfferingController extends abstract_controller_1.default {
    constructor() {
        super(...arguments);
        this.validator = new instituteSubjectOffering_validator_1.default();
        this.service = new instituteSubjectOffering_service_1.default();
        this.createSubjectOffering = this.asyncWrapper.wrap({ bodySchema: this.validator.createSubjectOffering }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.createSubjectOffering(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        this.updateSubjectOffering = this.asyncWrapper.wrap({ bodySchema: this.validator.updateSubjectOffering }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.updateSubjectOffering(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        this.getSubjectOfferings = this.asyncWrapper.wrap({ querySchema: this.validator.getAllSubjectOfferings }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.getSubjectOfferings(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        this.deleteSubjectOffering = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.deleteSubjectOffering(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = InstituteSubjectOfferingController;
