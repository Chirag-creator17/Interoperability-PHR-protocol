const express = require("express");
const router = express.Router();
const controller = require("../utils.js");

router.get("/getPHR", controller.getPHR);

module.exports = router;
