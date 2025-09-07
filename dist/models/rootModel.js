"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../app/database");
const commonModel_1 = __importDefault(require("./commonModel/commonModel"));
const errorLogsModel_1 = __importDefault(require("./errorLogsModel/errorLogsModel"));
const userModel_1 = __importDefault(require("./userModel/userModel"));
class Models {
    // User Model
    UserModel(trx) {
        return new userModel_1.default(trx || database_1.db);
    }
    CommonModel(trx) {
        return new commonModel_1.default(trx || database_1.db);
    }
    ErrorLogsModel(trx) {
        return new errorLogsModel_1.default(trx || database_1.db);
    }
}
exports.default = Models;
