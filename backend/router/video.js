const express = require("express");
const router = express.Router();

const { getVideoToken } = require("../router_handler/video");

router.post("/get", getVideoToken);

module.exports = router;
