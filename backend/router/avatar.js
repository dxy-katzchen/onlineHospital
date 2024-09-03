const express = require("express");
const router = express.Router();
const {
  updatePatientAvatar,
  updateDoctorAvatar,
} = require("../router_handler/avatar");
const expressJoi = require("@escook/express-joi");
const {
  update_doctor_avatar_schema,
  update_patient_avatar_schema,
} = require("../schema/avatar");

router.post(
  "/patient",
  expressJoi(update_patient_avatar_schema),
  updatePatientAvatar
);
router.post(
  "/doctor",
  expressJoi(update_doctor_avatar_schema),
  updateDoctorAvatar
);

module.exports = router;
