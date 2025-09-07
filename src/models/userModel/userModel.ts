import { TDB } from "../../features/public/utils/types/publicCommon.types";

import Schema from "../../utils/miscellaneous/schema";
import {
  ICheckUserData,
  ICheckUserParams,
  ICreateUserPayload,
} from "../../utils/modelTypes/userModelTypes/userModelTypes";

export default class UserModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  public async createUser(
    payload: ICreateUserPayload
  ): Promise<{ id: number }[]> {
    return await this.db("users")
      .withSchema(this.DBO_SCHEMA)
      .insert(payload, "id");
  }

  //update
  public async updateProfile(
    payload: Partial<ICreateUserPayload> & { socket_id?: string },
    id: number
  ) {
    return await this.db("users")
      .withSchema(this.DBO_SCHEMA)
      .update(payload)
      .where((qb) => {
        qb.where("id", id);
      });
  }

  public async checkUser({
    email,
    id,
    login_id,
    type,
    phone,
    code,
  }: ICheckUserParams): Promise<ICheckUserData> {
    return await this.db("users")
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
          } else {
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
  }

  public async getSingleCommonAuthUser<T>({
    schema_name,
    table_name,
    user_id,
    login_id,
    email,
    phone,
  }: {
    schema_name: "dbo" | "exhibitor" | "visitor";
    table_name: any;
    user_id?: number;
    login_id?: string;
    email?: string;
    phone?: string;
  }): Promise<T> {
    return await this.db(table_name)
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
  }

  //get last  user Id
  public async getLastUserID(): Promise<number> {
    const data = await this.db("users")
      .withSchema(this.DBO_SCHEMA)
      .select("id")
      .orderBy("id", "desc")
      .limit(1);

    return data.length ? Number(data[0].id) + 1 : 1;
  }

  public async deleteUser(id: number) {
    return await this.db("users")
      .withSchema(this.DBO_SCHEMA)
      .update({ is_deleted: true })
      .where({ id });
  }
}
