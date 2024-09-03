const joi = require("joi");

const appt_id = joi.number().min(1).integer().required();
const doc_id = joi.number().min(1).integer().required();
const patient_id = joi.number().min(1).integer().required();

exports.add_video_schema = {
  appt_id,
  doc_id,
  patient_id,
};

exports.get_video_schema = {
  appt_id,
};
