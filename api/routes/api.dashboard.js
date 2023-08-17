const express = require("express");
const router = express.Router();
const controller = require("../utils.js");
const auth = require("../utils/auth");

router.get("/getPHR", auth, controller.getPHR);

module.exports = router;
