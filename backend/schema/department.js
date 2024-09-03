const joi = require("joi");

const dept_name = joi.string().required();
const dept_desc = joi.string().required();
const pageCurr = joi.number().min(1).integer().required();
const dept_id = joi.number().min(1).integer().required();

exports.reg_dept_schema = {
  dept_desc,
  dept_name,
};

exports.dept_list_schema = {
  pageCurr,
};

exports.doc_list_schema = {
  dept_id,
};
