const express = require("express");
const router = express.Router();
const {
  createPrescription,
  addDrugPrescription,
  getPsDetail,
  deleteDrugPrescription,
  getPsId,
  payPs,
  getMyPsList,
  getApptId
} = require("../router_handler/presciption");
const expressJoi = require("@escook/express-joi");
const {
  create_ps_schema,
  add_ps_drug_schema,
  get_ps_dtl_schema,
  delete_ps_drug_schema,
  get_ps_id_schema,
  pay_schema,
  get_appt_id_schema
} = require("../schema/prescription");

router.post("/create", expressJoi(create_ps_schema), createPrescription);
router.post("/getPsId", expressJoi(get_ps_id_schema), getPsId);
router.post("/getApptId", expressJoi(get_appt_id_schema), getApptId);
router.post("/addDrugPs", expressJoi(add_ps_drug_schema), addDrugPrescription);
router.post("/detail", expressJoi(get_ps_dtl_schema), getPsDetail);
router.post("/pay", expressJoi(pay_schema), payPs);
router.post("/getMyList", getMyPsList);
router.post(
  "/deleteDrugPs",
  expressJoi(delete_ps_drug_schema),
  deleteDrugPrescription
);

module.exports = router;
