const joi = require("joi");

const password = joi.string().min(6).max(20).required();
const email = joi.string().email().required();
const phone = joi
  .string()
  .regex(/^(?:\+?64|0)(?:2\d{1}|[3-9]\d{1})(?:[- ]?\d{3,4}){2}$/);
const account = joi.string().required();
exports.reg_admin_schema = {
  body: {
    email,
    password,
    phone,
  },
};
exports.login_admin_schema = {
  account,
  password,
};
