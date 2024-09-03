const joi = require("joi");

const appt_id = joi.number().integer().required();
const ps_id = joi.number().integer().required();

const drug_name = joi.string().required();
const quantity = joi.number().integer().min(1).required();

exports.create_ps_schema = {
  body: {
    appt_id,
  },
};

exports.get_ps_id_schema = {
  body: {
    appt_id,
  },
};

exports.add_ps_drug_schema = {
  body: {
    ps_id,
    drug_name,
    quantity,
  },
};
exports.delete_ps_drug_schema = {
  body: {
    ps_id,
    drug_name,

  },
};

exports.get_ps_dtl_schema = {
  body: {
    ps_id,
  },
};
exports.get_appt_id_schema = {
  body: {
    ps_id,
  },
};
exports.pay_schema = {
  body: {
    ps_id,
  },
};

