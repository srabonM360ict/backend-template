import { Knex } from "knex";
import {
  USER_STATUS,
  USER_TYPE,
} from "../../../../utils/miscellaneous/constants";

// Db or Transaction connection types
export type TDB = Knex | Knex.Transaction;

export interface ITokenParseVisitor {
  user_id: number;
  name: string;
  is_main: boolean;
  photo: string | null;
  user_email: string;
  phone: string | null;
  status: boolean;
}

export type TypeUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export type TypeUser = (typeof USER_TYPE)[keyof typeof USER_TYPE];
