import { NextFunction, Request, Response } from "express";
import config from "../../app/config";

import { ITokenParseVisitor } from "../../features/public/utils/types/publicCommon.types";
// import VisitorModel from "../../models/visitorModel/visitorModel";
import Lib from "../../utils/lib/lib";
import ResMsg from "../../utils/miscellaneous/responseMessage";
import StatusCode from "../../utils/miscellaneous/statusCode";

export default class AuthChecker {
  // Visitor auth checker
  public visitorAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
      return;
    }
    const authSplit = authorization.split(" ");
    if (authSplit.length !== 2) {
      res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
      return;
    }
    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_VISITOR
    ) as ITokenParseVisitor;
    // if (!verify) {
    //   res
    //     .status(StatusCode.HTTP_UNAUTHORIZED)
    //     .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    //   return;
    // } else {
    //   const { user_id } = verify;
    //   const userModel = new VisitorModel(db);
    //   const checkVisitor = await userModel.getSingleVisitor({
    //     id: user_id,
    //   });
    //   if (checkVisitor) {
    //     if (!checkVisitor.status) {
    //       res
    //         .status(StatusCode.HTTP_UNAUTHORIZED)
    //         .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    //     }
    //     req.visitor = {
    //       is_main: checkVisitor.is_main,
    //       name: checkVisitor.name,
    //       photo: checkVisitor.photo,
    //       user_email: checkVisitor.email,
    //       user_id,
    //       status: checkVisitor.status,
    //       login_id: checkVisitor.login_id,
    //       phone: checkVisitor.phone,
    //     };
    //     next();
    //   } else {
    //     res
    //       .status(StatusCode.HTTP_UNAUTHORIZED)
    //       .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    //   }
    // }
  };
}
