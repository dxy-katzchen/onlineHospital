const express = require("express");
const router = express.Router();
const expressJoi = require("@escook/express-joi");
const {
  addDrugs,
  getDrugInfo,
  getDrugList,
  deleteDrug
} = require("../router_handler/drug");
const { add_drug_schema, get_info_schema } = require("../schema/drug");

router.post("/add", expressJoi(add_drug_schema), addDrugs);
router.post("/Info", expressJoi(get_info_schema), getDrugInfo);
router.post("/delete", expressJoi(get_info_schema), deleteDrug);
router.post("/getList", getDrugList);

module.exports = router;
