import Joi from "joi";
import { IStudentSchema } from "../types/student";

export const createStudentValidate = (data: IStudentSchema) => {
  const rule = Joi.object({
    fullName: Joi.string().required().messages({
      "string.empty": "Full name can not be empty!",
      "any.required": "Full name is required!",
    }),
    classSchool: Joi.string().required().messages({
      "string.empty": "Class can not be empty!",
      "any.required": "Class is required!",
    }),
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
    phone: Joi.string()
      .regex(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.empty": "Phone number can not be empty!",
        "string.pattern.base": "Invalid phone number!",
        "any.required": "Phone number is required!",
      }),
    gender: Joi.string().required().messages({
      "string.empty": "Gender can not be empty!",
      "any.required": "Gender is required!",
    }),
  });

  return rule.validate(data);
};
