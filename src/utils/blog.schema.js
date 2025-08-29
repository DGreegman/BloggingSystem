import Joi from "joi";

const postValidationSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Title should be a type of text",
    "string.empty": "Title is required",
    "any.required": "Title is required"
  }),
  content: Joi.string().required().messages({
    "string.base": "Content should be a type of text",
    "string.empty": "Content is required",
    "any.required": "Content is required"
  })
});

export default postValidationSchema;
