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
class SemesterModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createSemester(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("semesters")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    updateSemester(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("semesters")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update(payload)
                .where("id", id);
        });
    }
    deleteSemester(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("semesters")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update({ is_deleted: true })
                .where("id", id);
        });
    }
    getAllSemesters(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, isTotal = false) {
            const { limit, skip, name, status, id, institute_id, } = query;
            const filterQuery = this.db("semesters as sem")
                .withSchema(this.INSTITUTE_SCHEMA)
                .where((qb) => {
                qb.where("sem.is_deleted", false);
                if (institute_id) {
                    qb.andWhere("sem.institute_id", institute_id);
                }
                if (name) {
                    qb.andWhere("sem.name", name);
                }
                if (status !== undefined) {
                    qb.andWhere("sem.status", status);
                }
                if (id) {
                    qb.andWhere("sem.id", id);
                }
            });
            const dataQuery = filterQuery
                .clone()
                .select("sem.id", "sem.name", "sem.status", "sem.created_by", "cu.name as created_by_name", "sem.created_at")
                .joinRaw("LEFT JOIN dbo.users cu ON cu.id = sem.created_by")
                .orderBy("sem.id", "desc");
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
                    .count("sem.id as total")
                    .first();
                total = Number((result === null || result === void 0 ? void 0 : result.total) || "0");
            }
            return { data, total };
        });
    }
}
exports.default = SemesterModel;
