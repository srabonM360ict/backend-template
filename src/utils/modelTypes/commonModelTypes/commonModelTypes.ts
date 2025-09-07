import { GENERATE_AUTO_UNIQUE_ID } from "../../miscellaneous/constants";

export interface IInsertLastNoPayload {
  last_id: number;
  type: (typeof GENERATE_AUTO_UNIQUE_ID)[keyof typeof GENERATE_AUTO_UNIQUE_ID];
  last_updated: Date;
}

export interface IUpdateLastNoPayload {
  last_id: number;
  last_updated: Date;
}

export interface IGetLastIdParams {
  type: (typeof GENERATE_AUTO_UNIQUE_ID)[keyof typeof GENERATE_AUTO_UNIQUE_ID];
}

export interface IGetLastIdData {
  id: number;
  last_id: number;
}

export interface IForgetPasswordPayload {
  token: string;
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface IGetOTP {
  id: number;
  hashed_otp: string;
  tried: number;
  create_date: string | Date;
}

export interface ICommonCreateResponse {
  id: number;
}
