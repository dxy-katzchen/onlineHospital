const joi = require("joi");

//Doctor Registration
const doc_name = joi.string().min(2).max(10);
const password = joi.string().min(6).max(20).required();
const email = joi.string().email().required();
/**
 * 1 - Consultant
 * 2 - Fellow
 * 3 - Resident
 * 4 - Attending Physician
 */
const title_id = joi.number().integer().min(1).max(4).required();
const dept_id = joi.number().integer().required();
const avatar = joi.string().required();
const description = joi.string().required();
const phone = joi
  .string()
  .regex(/^(?:\+?64|0)(?:2\d{1}|[3-9]\d{1})(?:[- ]?\d{3,4}){2}$/);
const account = joi.string().required();

exports.reg_doctor_schema = {
  doc_name,
  password,
  email,
  title_id,
  dept_id,
  avatar,
  description,
  phone,
};

exports.login_doctor_schema = {
  account,
  password,
};
