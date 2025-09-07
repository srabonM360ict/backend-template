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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class InstituteModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //create audit
    createAudit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("audit_trail")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload);
        });
    }
    getAudit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("audit_trail as at")
                .withSchema(this.INSTITUTE_SCHEMA)
                .joinRaw(`LEFT JOIN dbo.users AS u ON u.id = at.created_by`)
                .select("at.id", "at.endpoint", "at.details", "at.payload", "u.id as created_by", "u.name as created_by_name", "at.type", "at.created_at")
                .limit(payload.limit ? payload.limit : 100)
                .offset(payload.skip ? payload.skip : 0)
                .orderBy("at.id", "asc")
                .where((qb) => {
                if (payload.institute_id) {
                }
                if (payload.created_by) {
                    qb.andWhere("at.created_by", payload.created_by);
                }
                if (payload.from_date) {
                    qb.andWhere("at.created_at", ">=", payload.from_date);
                }
                if (payload.to_date) {
                    qb.andWhere("at.created_at", "<=", payload.to_date);
                }
                if (payload.type) {
                    qb.andWhere("at.type", payload.type);
                }
            })
                .orderBy("at.id", "desc")
                .limit(payload.limit || 100)
                .offset(payload.skip || 0);
            const total = yield this.db("audit_trail as at")
                .withSchema(this.INSTITUTE_SCHEMA)
                .count("at.id as total")
                .where((qb) => {
                if (payload.institute_id) {
                }
                if (payload.created_by) {
                    qb.andWhere("at.created_by", payload.created_by);
                }
                if (payload.from_date) {
                    qb.andWhere("at.created_at", ">=", payload.from_date);
                }
                if (payload.to_date) {
                    qb.andWhere("at.created_at", "<=", payload.to_date);
                }
                if (payload.type) {
                    qb.andWhere("at.type", payload.type);
                }
            });
            return { data, total: total[0].total };
        });
    }
    getErrorLogs(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("error_logs as el")
                .withSchema(this.DBO_SCHEMA)
                .select("el.id", "el.level", "el.message", "el.stack_trace", "el.source", "el.institute_id", "el.user_id", "el.url", "el.http_method", "el.metadata", "u.name as user_name", "el.created_at")
                .leftJoin("users as u", "u.id", "el.user_id")
                .where((qb) => {
                if (payload.institute_id) {
                    qb.andWhere("el.institute_id", payload.institute_id);
                }
                if (payload.from_date) {
                    qb.andWhere("el.created_at", ">=", payload.from_date);
                }
                if (payload.to_date) {
                    qb.andWhere("el.created_at", "<=", payload.to_date);
                }
            })
                .orderBy("el.id", "desc")
                .limit(payload.limit || 100)
                .offset(payload.skip || 0);
            const total = yield this.db("error_logs as el")
                .withSchema(this.DBO_SCHEMA)
                .count("el.id as total")
                .where((qb) => {
                if (payload.institute_id) {
                    qb.andWhere("el.institute_id", payload.institute_id);
                }
                if (payload.from_date) {
                    qb.andWhere("el.created_at", ">=", payload.from_date);
                }
                if (payload.to_date) {
                    qb.andWhere("el.created_at", "<=", payload.to_date);
                }
            })
                .first();
            return { data, total: total === null || total === void 0 ? void 0 : total.total };
        });
    }
    // create Institute
    createInstitute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("institutes")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    // update Institute
    updateInstitute(payload, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("institutes")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update(payload)
                .where("id", query.id);
        });
    }
    //get single Institute
    getSingleInstitute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("institutes as ins")
                .withSchema(this.INSTITUTE_SCHEMA)
                .select("ins.id", "ins.institution_code", "ins.established_year", "ins.name as institute_name", "ins.phone as institute_phone", "ins.email as institute_email", "ins.logo as institute_logo", "ins.website as institute_website", "ins.category as category", "ins.ownership as ownership", "ins.address as address", "ins.postal_code", "ins.status", "ins.created_at", "ins.created_by", "cu.name as created_by_name", this.db.raw(`
        json_build_object(
          'id', iu.user_id,
          'name', u.name,
          'email', u.email,
          'phone', u.phone,
          'gender', iu.gender,
          'blood_group', iu.blood_group,
          'nid', iu.nid
        ) as institute_head
      `))
                .joinRaw(`LEFT JOIN dbo.users AS cu ON cu.id = ins.created_by`)
                .joinRaw(`LEFT JOIN institute.institute_users AS iu ON iu.institute_id = ins.id AND iu.is_main = true`)
                .joinRaw(`LEFT JOIN dbo.users AS u ON u.id = iu.user_id`)
                .where((qb) => {
                if (payload.id) {
                    qb.andWhere("ins.id", payload.id);
                }
                if (payload.institution_code) {
                    qb.andWhere("ins.institution_code", payload.institution_code);
                }
                if (payload.name) {
                    qb.andWhere("ins.name", payload.name);
                }
                if (payload.email) {
                    qb.andWhere("ins.email", payload.email);
                }
                if (payload.phone) {
                    qb.andWhere("ins.phone", payload.phone);
                }
                if (payload.website) {
                    qb.andWhere("ins.website", payload.website);
                }
                if (payload.institute_id) {
                    qb.andWhere("ins.id", payload.institute_id);
                }
            })
                .first();
        });
    }
    // Get all institute
    getAllInstitute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit = 100, skip = 0 } = payload;
            const result = yield this.db("institutes as ins")
                .withSchema(this.INSTITUTE_SCHEMA)
                .select("ins.id", "ins.institution_code", "ins.established_year", "ins.name as institute_name", "ins.phone as institute_phone", "ins.email as institute_email", "ins.logo as institute_logo", "ins.website as institute_website", "ins.category as category", "ins.ownership as ownership", "ins.address as address", "ins.postal_code", "ins.status", "ins.created_at", "ins.created_by", "cu.name as created_by_name", this.db.raw("COUNT(*) OVER() as total_count"))
                .where((qb) => {
                if (payload.institution_code) {
                    qb.andWhere("ins.institution_code", payload.institution_code);
                }
                if (payload.name) {
                    qb.andWhereILike("ins.name", `%${payload.name}%`);
                }
                if (payload.email) {
                    qb.andWhereILike("ins.email", `%${payload.email}%`);
                }
                if (payload.phone) {
                    qb.andWhereILike("ins.phone", `%${payload.phone}%`);
                }
            })
                .joinRaw(`LEFT JOIN dbo.users AS cu ON cu.id = ins.created_by`)
                .limit(limit)
                .offset(skip);
            const total = result.length ? Number(result[0].total_count) : 0;
            return {
                total,
                data: result.map((r) => {
                    const { total_count } = r, rest = __rest(r, ["total_count"]);
                    return rest;
                }),
            };
        });
    }
    createInstituteUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("institute_users")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "user_id");
        });
    }
    getSingleInstituteUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("institute_users as insu")
                .withSchema(this.INSTITUTE_SCHEMA)
                .select("insu.user_id", "insu.institute_id", "iu.name", "iu.email", "iu.phone", "iu.photo", "iu.password_hash", "iu.login_id", "insu.blood_group", "insu.status", "iu.user_type", "insu.is_main", "insu.created_by", "iu.is_2fa_on", "insu.gender", "insu.nid")
                .joinRaw(`LEFT JOIN dbo.users AS iu ON iu.id = insu.user_id`)
                .where((qb) => {
                if (payload.institute_id) {
                    qb.andWhere("insu.institute_id", payload.institute_id);
                }
                if (payload.user_id) {
                    qb.andWhere("insu.user_id", payload.user_id);
                }
                if (payload.user_type) {
                    qb.andWhere("insu.user_type", payload.user_type);
                }
            })
                .first();
        });
    }
    updateInstituteUser(payload, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("institute_users")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update(payload)
                .where("user_id", query.id);
        });
    }
}
exports.default = InstituteModel;
