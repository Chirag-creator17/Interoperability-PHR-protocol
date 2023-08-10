const express = require("express");
const router = express.Router();
const controller = require("../utils.js");

router.post("/phone", controller.loginPhone);
router.post("/otp", controller.loginOtp);

module.exports = router;
