const express = require("express");
const router = express.Router();
const { regDoctor, loginDoctor,getAllDeptList } = require("../router_handler/doctor");
const expressJoi = require("@escook/express-joi");
const { reg_doctor_schema, login_doctor_schema } = require("../schema/doctor");

router.post("/register", expressJoi(reg_doctor_schema), regDoctor);
router.post("/login", expressJoi(login_doctor_schema), loginDoctor);
router.post("/department/getAllDeptList", getAllDeptList);

module.exports = router;
