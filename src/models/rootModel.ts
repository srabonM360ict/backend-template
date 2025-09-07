import { Knex } from "knex";
import { db } from "../app/database";
import CommonModel from "./commonModel/commonModel";
import ErrorLogsModel from "./errorLogsModel/errorLogsModel";
import UserModel from "./userModel/userModel";

export default class Models {
  // User Model
  public UserModel(trx?: Knex.Transaction) {
    return new UserModel(trx || db);
  }

  public CommonModel(trx?: Knex.Transaction) {
    return new CommonModel(trx || db);
  }

  public ErrorLogsModel(trx?: Knex.Transaction) {
    return new ErrorLogsModel(trx || db);
  }
}
