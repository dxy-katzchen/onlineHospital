const express = require("express");
const router = express.Router();
const expressJoi = require("@escook/express-joi");
const {
  add_video_schema,
  get_video_schema,
} = require("../schema/consultation");
const {
  getImgTxtConsultation,
  addVideoConsultation,
  getVideoConsultation,
} = require("../router_handler/consultation");

router.post("/video/add", expressJoi(add_video_schema), addVideoConsultation);
router.post("/video/get", expressJoi(get_video_schema), getVideoConsultation);
router.post("/imgText/get", getImgTxtConsultation);

module.exports = router;
