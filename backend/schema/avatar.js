const joi = require("joi");

const avatar = joi.string().required();
const patient_id = joi.number().integer().required();
const doc_id = joi.number().integer().required();

exports.update_patient_avatar_schema={
    body:{
      patient_id,
      avatar
    }
  }
  
exports.update_doctor_avatar_schema={
    body:{
      doc_id,
      avatar
    }
  }
  