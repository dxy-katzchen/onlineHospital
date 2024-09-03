const express = require("express");
const router = express.Router();
const {
  addMedicalHistory,
  getPatientMedicalHistory,
  getMedicalHistory,
  getMyMedicalHistoryList,
} = require("../router_handler/medical_history");
const expressJoi = require("@escook/express-joi");
const {
  add_med_hist_schema,
  get_med_hist_schema,
  get_single_schema,
} = require("../schema/medical_history");

router.post("/add", expressJoi(add_med_hist_schema), addMedicalHistory);
router.post("/getMyList", getMyMedicalHistoryList);
router.post("/get", expressJoi(get_med_hist_schema), getPatientMedicalHistory);
router.post("/getById", expressJoi(get_single_schema), getMedicalHistory);

module.exports = router;
