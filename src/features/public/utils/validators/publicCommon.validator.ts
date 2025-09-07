import Joi from "joi";

export default class PublicCommonValidator {
  public singleParamNumValidator = (idFieldName: string = "id") => {
    const schemaObject: any = {};
    schemaObject[idFieldName] = Joi.number().required();
    return Joi.object(schemaObject);
  };

  // single param string validator
  public singleParamStringValidator = (idFieldName: string = "id") => {
    const schemaObject: any = {};
    schemaObject[idFieldName] = Joi.string().required();
    return Joi.object(schemaObject);
  };

  // multiple params number validator
  public multipleParamsNumValidator(fields: string[]) {
    const schemaObject: any = {};

    fields.forEach((item) => {
      schemaObject[item] = Joi.number().required();
    });

    return Joi.object(schemaObject);
  }

  // multiple params string validator
  public multipleParamsStringValidator(fields: string[]) {
    const schemaObject: any = {};

    fields.forEach((item) => {
      schemaObject[item] = Joi.number().required();
    });

    return Joi.object(schemaObject);
  }

  // common login input validator
  loginValidator = Joi.object({
    login_id_or_email: Joi.string().max(255).required().lowercase().messages({
      "string.base": "Enter valid login_id or email",
      "any.required": "login_id or email is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": "Enter valid password",
      "string.min": "Enter valid password minimum length 8",
      "any.required": "Password is required",
    }),
  });
  loginIDValidator = Joi.object({
    login_id: Joi.string().max(255).required().lowercase().messages({
      "string.base": "Enter valid Login ID",
      "any.required": "Login ID is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": "Enter valid password",
      "string.min": "Enter valid password minimum length 8",
      "any.required": "Password is required",
    }),
  });

  // common forget password input validator
  commonForgetPassInputValidation = Joi.object({
    token: Joi.string().required().messages({
      "string.base": "Provide valid token",
      "any.required": "Token is required",
    }),
    email: Joi.string().email().optional().lowercase().messages({
      "string.base": "Provide valid email",
      "string.email": "Provide valid email",
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": "Provide valid password",
      "string.min": "Please provide valid password that's length must be min 8",
      "any.required": "Password is required",
    }),
  });

  commonTwoFAInputValidation = Joi.object({
    token: Joi.string().required().messages({
      "string.base": "Provide valid token",
      "any.required": "Token is required",
    }),
    email: Joi.string().email().optional().lowercase().messages({
      "string.base": "Provide valid email",
      "string.email": "Provide valid email",
    }),
  });

  // common change password input validation
  changePassInputValidation = Joi.object({
    old_password: Joi.string().min(8).required().messages({
      "string.base": "Provide a valid old password",
      "string.min": "Provide a valid old password minimum length is 8",
      "any.required": "Old password is required",
    }),
    new_password: Joi.string().min(8).required().messages({
      "string.base": "Provide a valid new password",
      "string.min": "Provide a valid new password minimum length is 8",
      "any.required": "New password is required",
    }),
  });

  getNotificationValidator = Joi.object({
    limit: Joi.number().integer().positive().optional(),
    skip: Joi.number().integer().positive().optional(),
  });
  mutationNotificationValidator = Joi.object({
    id: Joi.number().integer().positive().optional(),
  });

  // get single item with id validator
  public getSingleItemWithIdValidator = Joi.object({
    id: Joi.number().integer().required(),
  });
}
