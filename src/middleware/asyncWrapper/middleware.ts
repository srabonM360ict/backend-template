import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import CustomError from "../../utils/lib/customError";
import ManageFile from "../../utils/lib/manageFile";
import StatusCode from "../../utils/miscellaneous/statusCode";

type Func = (req: Request, res: Response, next: NextFunction) => Promise<void>;

type Validators = {
  bodySchema?: Joi.ObjectSchema<any>;
  paramSchema?: Joi.ObjectSchema<any>;
  querySchema?: Joi.ObjectSchema<any>;
};

export default class Wrapper {
  private manageFile = new ManageFile();
  public wrap(schema: Validators | null, cb: Func) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { params, query, body } = req;
        if (schema) {
          if (schema.bodySchema) {
            const validateBody = await schema.bodySchema.validateAsync(body);
            req.body = validateBody;
          }
          if (schema.paramSchema) {
            const validateParams = await schema.paramSchema.validateAsync(
              params
            );
            req.params = validateParams;
          }
          if (schema.querySchema) {
            const validateQuery = await schema.querySchema.validateAsync(query);
            req.query = validateQuery;
          }
        }

        await cb(req, res, next);
      } catch (err: any) {
        if (req.upFiles?.length) {
          await this.manageFile.deleteFromCloud(req.upFiles);
        }

        if (err.isJoi) {
          return next(
            new CustomError(err.message, StatusCode.HTTP_UNPROCESSABLE_ENTITY)
          );
        }

        return next(
          new CustomError(err.message, err.status, err.level, err.metadata)
        );
      }
    };
  }
}
