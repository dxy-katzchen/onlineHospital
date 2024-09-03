const joi = require("joi");

const doc_id = joi.number().integer().min(1).required();
const desc = joi.string().required();
const status = joi.string().required();
const consult_type = joi.number().integer().min(0).max(1);
const appt_id = joi.number().integer().min(1).required();

exports.add_appt_schema = {
  body: {
    doc_id,
    desc,
    consult_type,
  },
};
exports.get_appt_schema = {
  body: {
    appt_id,
  },
};
exports.change_appt_status_schema = {
  body: {
    appt_id,
    status,
  },
};
