import { TypeUser } from "../../../features/public/utils/types/publicCommon.types";

export interface ICreateUserPayload {
  login_id?: string;
  code: string;
  name: string;
  email?: string;
  password_hash: string;
  phone?: string;
  photo?: string;
  user_type: TypeUser;
  is_2fa_on?: boolean;
}

export interface ICheckUserParams {
  id?: number;
  email?: string;
  login_id?: string;
  code?: string;
  type?: string;
  phone?: string;
}

export interface ICheckUserData {
  id: number;
  login_id: string;
  code: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  photo: string | null;
  created_at: string;
  type: TypeUser;
  socket_id: string;
  is_online: boolean;
  status: boolean;
  is_deleted: boolean;
  location_id?: number;
}
