const joi = require("joi");

const drug_name = joi.string().required();
const usage = joi.string().required();
const cure = joi.string().required();
const single_price = joi.number().min(0).required();

exports.add_drug_schema = {
  body: {
    drug_name,
    usage,
    cure,
    single_price,
  },
};
exports.get_info_schema = {
  body: {
    drug_name,
  },
};
