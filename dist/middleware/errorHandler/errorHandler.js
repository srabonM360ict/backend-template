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
const rootModel_1 = __importDefault(require("../../models/rootModel"));
const manageFile_1 = __importDefault(require("../../utils/lib/manageFile"));
const constants_1 = require("../../utils/miscellaneous/constants");
class ErrorHandler {
    constructor() {
        // handleErrors
        this.handleErrors = (err, req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            // // file removing starts
            const files = req.upFiles || [];
            if (files.length) {
                yield this.manageFile.deleteFromCloud(files);
            }
            //insert error logs
            const errorDetails = {
                message: err.message,
                route: req.originalUrl,
                method: req.method,
                stack: err.stack,
                user_id: req.visitor.id || undefined,
                source: req.visitor.id ? constants_1.SOURCE_VISITOR : constants_1.SOURCE_EXTERNAL,
            };
            try {
                if (err.status == 500 || !err.status) {
                    yield new rootModel_1.default().ErrorLogsModel().insertErrorLogs({
                        level: err.level || "ERROR",
                        message: errorDetails.message || "Internal Server Error",
                        stack_trace: errorDetails.stack,
                        source: errorDetails.source,
                        user_id: errorDetails.user_id,
                        url: errorDetails.route,
                        http_method: errorDetails.method,
                        metadata: err.metadata,
                    });
                }
            }
            catch (err) {
                console.log({ err });
            }
            res
                .status(err.status || 500)
                .json({ success: false, message: err.message });
        });
        this.manageFile = new manageFile_1.default();
    }
}
exports.default = ErrorHandler;
