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
class SessionModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createSession(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("sessions")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    updateSession(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("sessions")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update(payload)
                .where("id", id);
        });
    }
    deleteSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("sessions")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update({ is_deleted: true })
                .where("id", id);
        });
    }
    getAllSessions(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, isTotal = false) {
            const { limit, skip, session_no, status, id, institute_id } = query;
            const filterQuery = this.db("sessions as ses")
                .withSchema(this.INSTITUTE_SCHEMA)
                .where((qb) => {
                qb.where("ses.is_deleted", false);
                if (institute_id) {
                    qb.andWhere("ses.institute_id", institute_id);
                }
                if (session_no) {
                    qb.andWhere("ses.session_no", session_no);
                }
                if (status !== undefined) {
                    qb.andWhere("ses.status", status);
                }
                if (id) {
                    qb.andWhere("ses.id", id);
                }
            });
            const dataQuery = filterQuery
                .clone()
                .select("ses.id", "ses.session_no", "ses.status", "ses.created_by", "cu.name as created_by_name", "ses.created_at")
                .joinRaw("LEFT JOIN dbo.users cu ON cu.id = ses.created_by")
                .orderBy("ses.id", "desc");
            if (limit) {
                dataQuery.limit(limit);
            }
            if (skip) {
                dataQuery.offset(skip);
            }
            const data = yield dataQuery;
            let total;
            if (isTotal) {
                const result = yield filterQuery
                    .clone()
                    .count("ses.id as total")
                    .first();
                total = Number((result === null || result === void 0 ? void 0 : result.total) || "0");
            }
            return { data, total };
        });
    }
}
exports.default = SessionModel;
