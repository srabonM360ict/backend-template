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
class ManagementModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create Management
    createManagement(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("admin_users")
                .withSchema(this.MANAGEMENT_SCHEMA)
                .insert(payload, "user_id");
        });
    }
    // update Management
    updateManagement(payload, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("admin_users")
                .withSchema(this.MANAGEMENT_SCHEMA)
                .update(payload)
                .where((qb) => {
                if (query.user_id) {
                    qb.andWhere("user_id", query.user_id);
                }
            });
        });
    }
    //get all Management
    getAllManagement(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, is_total = false) {
            var _a;
            const data = yield this.db("admin_users as au")
                .withSchema(this.MANAGEMENT_SCHEMA)
                .select("au.user_id", "u.login_id", "u.name", "u.email", "u.phone", "u.photo", "u.status", "u.socket_id", "u.is_online", "rl.name as role", "rl.id as role_id", "au.is_2fa_on", "au.is_main")
                .leftJoin("roles as rl", "rl.id", "au.role_id")
                .joinRaw("LEFT JOIN dbo.user u ON u.id = au.user_id")
                .where((qb) => {
                qb.where("u.is_deleted", false);
                if (query.filter) {
                    qb.andWhere((qbc) => {
                        qbc.where("u.login_id", "ilike", `%${query.filter}%`);
                        qbc.orWhere("u.email", "ilike", `%${query.filter}%`);
                        qbc.orWhere("u.phone", "ilike", `%${query.filter}%`);
                    });
                }
                if (query.role) {
                    qb.andWhere("rl.id", query.role);
                }
                if (query.status !== undefined) {
                    qb.andWhere("u.status", query.status);
                }
            })
                .orderBy("au.user_id", "desc")
                .limit(query.limit ? query.limit : 1000)
                .offset(query.skip ? query.skip : 0);
            let total = [];
            if (is_total) {
                total = yield this.db("management as au")
                    .withSchema(this.MANAGEMENT_SCHEMA)
                    .count("u.id as total")
                    .leftJoin("roles as rl", "rl.id", "au.role_id")
                    .joinRaw("LEFT JOIN dbo.user u ON u.id = au.user_id")
                    .where((qb) => {
                    if (query.filter) {
                        qb.where((qbc) => {
                            qbc.where("u.login_id", "ilike", `%${query.filter}%`);
                            qbc.orWhere("u.email", "ilike", `%${query.filter}%`);
                            qbc.orWhere("u.phone", "ilike", `%${query.filter}%`);
                        });
                    }
                    if (query.role) {
                        qb.andWhere("rl.id", query.role);
                    }
                    if (query.status !== undefined) {
                        qb.andWhere("u.status", query.status);
                    }
                });
            }
            return {
                data: data,
                total: (_a = total[0]) === null || _a === void 0 ? void 0 : _a.total,
            };
        });
    }
    //get single Management
    getSingleManagement(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("Payload for getSingleManagement:", payload);
            return yield this.db("admin_users as au")
                .select("u.id", "u.login_id", "u.name", "u.email", "u.phone", "u.photo", "u.password_hash", "au.status", "u.user_type", "u.is_2fa_on", "au.is_main", "au.created_by", "u.created_at", "cu.name as created_by_name")
                .withSchema(this.MANAGEMENT_SCHEMA)
                .joinRaw("LEFT JOIN dbo.users u ON u.id = au.user_id")
                .joinRaw("LEFT JOIN dbo.users cu ON cu.id = au.created_by")
                .where((qb) => {
                qb.where("u.is_deleted", false);
                if (payload.id) {
                    qb.andWhere("au.user_id", payload.id);
                }
                if (payload.email) {
                    qb.andWhere("u.email", payload.email);
                }
                if (payload.phone) {
                    qb.andWhere("u.phone", payload.phone);
                }
                if (payload.login_id) {
                    qb.andWhere("u.login_id", payload.login_id);
                }
            })
                .first();
        });
    }
}
exports.default = ManagementModel;
