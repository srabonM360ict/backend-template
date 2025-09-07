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
class UserModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("users")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload, "id");
        });
    }
    //update
    updateProfile(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("users")
                .withSchema(this.DBO_SCHEMA)
                .update(payload)
                .where((qb) => {
                qb.where("id", id);
            });
        });
    }
    checkUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, id, login_id, type, phone, code, }) {
            return yield this.db("users")
                .withSchema(this.DBO_SCHEMA)
                .select("*")
                .where((qb) => {
                qb.where("is_deleted", false).andWhere((qbc) => {
                    if (id) {
                        qbc.andWhere("id", id);
                    }
                    if (type) {
                        qbc.andWhere("user_type", type).andWhere((subQbc) => {
                            if (email) {
                                subQbc.andWhere("email", email);
                            }
                            if (login_id) {
                                subQbc.orWhere("login_id", login_id);
                            }
                            if (phone) {
                                subQbc.orWhere("phone", phone);
                            }
                            if (code) {
                                subQbc.orWhere("code", code);
                            }
                        });
                    }
                    else {
                        if (email) {
                            qbc.andWhere("email", email);
                        }
                        if (login_id) {
                            qbc.orWhere("login_id", login_id);
                        }
                        if (phone) {
                            qbc.orWhere("phone", phone);
                        }
                    }
                });
            })
                .first();
        });
    }
    getSingleCommonAuthUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ schema_name, table_name, user_id, login_id, email, phone, }) {
            return yield this.db(table_name)
                .withSchema(schema_name)
                .select("*")
                .where((qb) => {
                if (login_id) {
                    qb.orWhere("login_id", login_id);
                }
                if (email) {
                    qb.orWhere("email", email);
                }
                if (phone) {
                    qb.orWhere("phone", phone);
                }
                if (user_id) {
                    qb.andWhere("user_id", user_id);
                }
            })
                .first();
        });
    }
    //get last  user Id
    getLastUserID() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("users")
                .withSchema(this.DBO_SCHEMA)
                .select("id")
                .orderBy("id", "desc")
                .limit(1);
            return data.length ? Number(data[0].id) + 1 : 1;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("users")
                .withSchema(this.DBO_SCHEMA)
                .update({ is_deleted: true })
                .where({ id });
        });
    }
}
exports.default = UserModel;
