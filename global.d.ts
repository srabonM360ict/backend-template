import { ITokenParseManagement } from "./src/features/public/utils/types/publicCommon.types";
declare global {
  namespace Express {
    interface Request {
      visitor: ITokenParseManagement;

      upFiles: string[];
    }
  }
}
