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
const instituteBatchWiseSemester_service_1 = require("../services/instituteBatchWiseSemester.service");
const instituteBatchWiseSemester_validator_1 = require("../utils/validator/instituteBatchWiseSemester.validator");
class InstituteBatchWiseSemesterController extends abstract_controller_1.default {
    constructor() {
        super(...arguments);
        this.validator = new instituteBatchWiseSemester_validator_1.InstituteBatchWiseSemesterValidator();
        this.service = new instituteBatchWiseSemester_service_1.InstituteBatchWiseSemesterService();
        this.createBatchWiseSemester = this.asyncWrapper.wrap({ bodySchema: this.validator.createBatchWiseSemesterSchema }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.createBatchWiseSemester(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        this.getAllBatchWiseSemester = this.asyncWrapper.wrap({
            querySchema: this.validator.getAllBatchWiseSemesterSchema,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.getAllBatchWiseSemester(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        this.deleteBatchWiseSemester = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.deleteBatchWiseSemester(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        this.updateBatchWiseSemester = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.validator.updateBatchWiseSemesterSchema,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.updateBatchWiseSemester(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // public getSingleBatchWiseSemester = this.asyncWrapper.wrap(
        //   {
        //     paramSchema: this.commonValidator.singleParamValidator,
        //     querySchema: this.validator.getSingleBatchWiseSemesterSemesterSchema,
        //   },
        //   async (req: Request, res: Response) => {
        //     const { code, ...data } = await this.service.getSingleBatchWiseSemester(req);
        //     res.status(code).json(data);
        //   }
        // );
        // public updateBatchWiseSemester = this.asyncWrapper.wrap(
        //   {
        //     paramSchema: this.commonValidator.singleParamValidator,
        //     bodySchema: this.validator.updateBatchWiseSemesterSchema,
        //   },
        //   async (req: Request, res: Response) => {
        //     const { code, ...data } = await this.service.updateBatchWiseSemester(req);
        //     res.status(code).json(data);
        //   }
        // );
        // public deleteBatchWiseSemester = this.asyncWrapper.wrap(
        //   { paramSchema: this.commonValidator.singleParamValidator },
        //   async (req: Request, res: Response) => {
        //     const { code, ...data } = await this.service.deleteBatchWiseSemester(req);
        //     res.status(code).json(data);
        //   }
        // );
    }
}
exports.default = InstituteBatchWiseSemesterController;
