const joi = require("joi");

const patient_name = joi.string().min(2).max(10);
const password = joi.string().min(6).max(20).required();
const email = joi.string().email().required();
const phone = joi
  .string()
  .regex(/^(?:\+?64|0)(?:2\d{1}|[3-9]\d{1})(?:[- ]?\d{3,4}){2}$/);
const gender = joi.string().regex(/^[0-1]$/);
const age = joi.number().integer().min(0).max(120).required();
const address = joi.string().required();
const account = joi.string().required();

exports.reg_patient_schema = {
  body: {
    patient_name,
    password,
    email,
    phone,
    gender,
    age,
    address,
  },
};

exports.login_patient_schema = {
  body: {
    account,
    password,
  },
};
