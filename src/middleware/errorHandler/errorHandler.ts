import { NextFunction, Request, Response } from "express";
import Models from "../../models/rootModel";
import CustomError from "../../utils/lib/customError";
import ManageFile from "../../utils/lib/manageFile";
import {
  SOURCE_EXHIBITOR,
  SOURCE_EXTERNAL,
  SOURCE_VISITOR,
} from "../../utils/miscellaneous/constants";

interface ICustomError {
  success: boolean;
  message: string;
  level?: string;
}

export default class ErrorHandler {
  private manageFile: ManageFile;

  constructor() {
    this.manageFile = new ManageFile();
  }

  // handleErrors
  public handleErrors = async (
    err: CustomError,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    // // file removing starts
    const files = req.upFiles || [];

    if (files.length) {
      await this.manageFile.deleteFromCloud(files);
    }

    //insert error logs
    const errorDetails = {
      message: err.message,
      route: req.originalUrl,
      method: req.method,
      stack: err.stack,
      user_id: req.visitor.id || undefined,
      source: req.visitor.id ? SOURCE_VISITOR : SOURCE_EXTERNAL,
    };
    try {
      if (err.status == 500 || !err.status) {
        await new Models().ErrorLogsModel().insertErrorLogs({
          level: err.level || "ERROR",
          message: errorDetails.message || "Internal Server Error",
          stack_trace: errorDetails.stack,
          source: errorDetails.source as
            | typeof SOURCE_EXHIBITOR
            | typeof SOURCE_VISITOR,
          user_id: errorDetails.user_id,

          url: errorDetails.route,
          http_method: errorDetails.method,
          metadata: err.metadata,
        });
      }
    } catch (err: any) {
      console.log({ err });
    }

    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  };
}
