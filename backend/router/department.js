const express = require("express");
const router = express.Router();
const {
  addDept,
  getDoctorList,
  getDeptList
} = require("../router_handler/department");
const expressJoi = require("@escook/express-joi");
const {
  reg_dept_schema,
  dept_list_schema,
  doc_list_schema,
} = require("../schema/department");

router.post("/add", expressJoi(reg_dept_schema), addDept);
router.post("/getDeptList", expressJoi(dept_list_schema), getDeptList);
router.post("/getDoctorList", expressJoi(doc_list_schema), getDoctorList);

module.exports = router;
