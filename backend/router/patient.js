const express = require("express");
const router = express.Router();
const {regPatient,loginPatient} = require("../router_handler/patient");
const expressJoi = require("@escook/express-joi");
const {
  reg_patient_schema,
  login_patient_schema,
  
} = require("../schema/patient");

router.post(
  "/register",
  expressJoi(reg_patient_schema),
  regPatient
);
router.post(
  "/login",
  expressJoi(login_patient_schema),
  loginPatient
);


module.exports = router;
