const express = require("express");
const router = express.Router();
const {
  addAppointment,
  getAppointment,
  getMyAppointmentList,
  changeStatus,
} = require("../router_handler/appointment");
const expressJoi = require("@escook/express-joi");
const {
  add_appt_schema,
  get_appt_schema,
  change_appt_status_schema,
} = require("../schema/appointment");

router.post("/add", expressJoi(add_appt_schema), addAppointment);

router.post("/get", expressJoi(get_appt_schema), getAppointment);

router.post("/getMyList", getMyAppointmentList);
router.post(
  "/changeStatus",
  expressJoi(change_appt_status_schema),
  changeStatus
);

module.exports = router;
