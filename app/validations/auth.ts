import Joi from "joi";

import { ISignInRequest, ISignUpRequest } from "../types/auth";

export const signUpValidate = (data: ISignUpRequest) => {
  const rule = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email can not be empty!",
      "string.email": "Invalid email!",
      "any.required": "Email is required!",
    }),
    password: Joi.string().min(4).required().messages({
      "string.empty": "Password can not be empty!",
      "string.min": "Password must be at least {{#limit}} characters!",
      "any.required": "Password is required!",
    }),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .options({
        messages: {
          "any.only": "Confirm password does not match!",
        },
      }),
    firstName: Joi.string().required().messages({
      "string.empty": "First name can not be empty!",
      "any.required": "First name is required!",
    }),
    lastName: Joi.string().required().messages({
      "string.empty": "Last name can not be empty!",
      "any.required": "Last name is required!",
    }),
  }).required();

  return rule.validate(data);
};

export const signInValidate = (data: ISignInRequest) => {
  const rule = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email can not be empty!",
      "string.email": "Invalid email!",
      "any.required": "Email is required!",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password can not be empty!",
      "any.required": "Password is required!",
    }),
  }).required();

  return rule.validate(data);
};
