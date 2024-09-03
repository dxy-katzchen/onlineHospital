const express = require("express");
const router = express.Router();
const expressJoi = require("@escook/express-joi");
const { reg_admin_schema, login_admin_schema } = require("../schema/admin");
const { regAdmin, loginAdmin } = require("../router_handler/admin");

router.post("/register", expressJoi(reg_admin_schema), regAdmin);
router.post("/login", expressJoi(login_admin_schema), loginAdmin);

module.exports = router;
