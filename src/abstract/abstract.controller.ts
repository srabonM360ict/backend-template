import PublicCommonValidator from "../features/public/utils/validators/publicCommon.validator";
import Wrapper from "../middleware/asyncWrapper/middleware";
import CustomError from "../utils/lib/customError";
import ResMsg from "../utils/miscellaneous/responseMessage";
import StatusCode from "../utils/miscellaneous/statusCode";

abstract class AbstractController {
  protected asyncWrapper: Wrapper;
  protected commonValidator = new PublicCommonValidator();
  constructor() {
    this.asyncWrapper = new Wrapper();
  }
  protected StatusCode = StatusCode;
  protected ResMsg = ResMsg;
  protected error(message?: string, status?: number) {
    throw new CustomError(
      message || ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      status || StatusCode.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
export default AbstractController;
