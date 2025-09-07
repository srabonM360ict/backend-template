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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class CommonModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    insertLastNo(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("last_no")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload, "id");
        });
    }
    updateLastNo(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("last_no")
                .withSchema(this.DBO_SCHEMA)
                .update(payload)
                .where("id", id);
        });
    }
    getLastId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ type, }) {
            return yield this.db("last_no")
                .withSchema(this.DBO_SCHEMA)
                .select("id", "last_id")
                .where("type", type)
                .first();
        });
    }
}
exports.default = CommonModel;
