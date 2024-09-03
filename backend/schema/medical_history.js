const joi = require("joi");

const appt_id = joi.number().integer().min(1).required();
const description = joi.string().required();

const patient_id = joi.number().integer().min(1).required();
const med_hist_id = joi.number().integer().min(1).required();

exports.add_med_hist_schema = {
  body: {
    appt_id,
    description,
  
  },
};
exports.get_med_hist_schema={
  body:{
    patient_id
  }
}
exports.get_single_schema={
  body:{
    med_hist_id
  }
}