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
class InstituteAdministrationModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //---Role---
    createRole(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("roles")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    // update role
    updateRole(_a, id_1) {
        return __awaiter(this, arguments, void 0, function* ({ name, status }, id) {
            return yield this.db("roles")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update({ name, status })
                .where({ id });
        });
    }
    roleList(limit_1, skip_1) {
        return __awaiter(this, arguments, void 0, function* (limit, skip, total = false) {
            var _a;
            const data = yield this.db("roles as rl")
                .withSchema(this.INSTITUTE_SCHEMA)
                .select("rl.id as role_id", "rl.name as role_name", "u.login_id as created_by", "rl.create_date")
                .leftJoin("institute as au", "au.user_id", "rl.created_by")
                .joinRaw("LEFT JOIN dbo.user u ON u.id = au.user_id")
                .limit(limit ? limit : 100)
                .offset(skip ? skip : 0)
                .orderBy("rl.id", "asc");
            let count = [];
            if (total) {
                count = yield this.db("roles as rl")
                    .withSchema(this.INSTITUTE_SCHEMA)
                    .count("rl.id as total")
                    .join("institute as au", "au.user_id", "rl.created_by")
                    .joinRaw("LEFT JOIN dbo.user u ON u.id = au.user_id");
            }
            return { data, total: (_a = count[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
    getSingleRole(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name, permission_id, }) {
            return yield this.db("roles as rol")
                .withSchema(this.INSTITUTE_SCHEMA)
                .select("rol.id as role_id", "rol.name as role_name", "rol.status", "rol.is_main_role", this.db.raw(`
      case when exists (
        select 1
        from ${this.INSTITUTE_SCHEMA}.role_permissions rp
        where rp.role_id = rol.id
      ) then (
        select json_agg(
          json_build_object(
            'permission_id', per.id,
            'permission_name', per.name,
            'read', rp.read,
            'write', rp.write,
            'update', rp.update,
            'delete', rp.delete
          )
                order by per.name asc
        )
        from ${this.INSTITUTE_SCHEMA}.role_permissions rp
        left join ${this.INSTITUTE_SCHEMA}.permissions per
        on rp.permission_id = per.id
        where rp.role_id = rol.id
        group by rp.role_id
      ) else '[]' end as permissions
    `))
                .where((qb) => {
                if (id) {
                    qb.where("rol.id", id);
                }
                if (name) {
                    qb.where("rol.name", name);
                }
                if (permission_id) {
                    qb.andWhere("per.id", permission_id);
                }
            });
        });
    }
    //---Permission---
    createPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("permissions")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "id");
        });
    }
    permissionsList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield this.db("permissions as per")
                .withSchema(this.INSTITUTE_SCHEMA)
                .select("per.id as permission_id", "per.name as permission_name", "u.login_id as created_by", "per.create_date")
                .leftJoin("institute as au", "au.user_id", "per.created_by")
                .joinRaw("LEFT JOIN dbo.user u ON u.id = au.user_id")
                .limit(params.limit ? params.limit : 100)
                .offset(params.skip ? params.skip : 0)
                .orderBy("per.id", "asc")
                .where((qb) => {
                if (params.name) {
                    qb.where("per.name", params.name);
                }
            });
            let count = [];
            count = yield this.db("permissions")
                .withSchema(this.INSTITUTE_SCHEMA)
                .count("id as total")
                .where((qb) => {
                if (params.name) {
                    qb.where("name", params.name);
                }
            });
            return { data, total: (_a = count[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
    //---Role Permission---
    createRolePermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role_permissions")
                .withSchema(this.INSTITUTE_SCHEMA)
                .insert(payload, "role_id");
        });
    }
    // delete role permission
    deleteRolePermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role_permissions")
                .withSchema(this.INSTITUTE_SCHEMA)
                .delete()
                .where("role_id", payload.role_id)
                .andWhere("permission_id", payload.permission_id);
        });
    }
    // update role permission
    updateRolePermission(payload, permission_id, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role_permissions")
                .withSchema(this.INSTITUTE_SCHEMA)
                .update(payload)
                .where("role_id", role_id)
                .andWhere("permission_id", permission_id);
        });
    }
    // get role permission
    getRolePermissions(role_id, permission_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("role_permissions")
                .withSchema(this.INSTITUTE_SCHEMA)
                .where({ role_id })
                .andWhere({ permission_id });
        });
    }
}
exports.default = InstituteAdministrationModel;
