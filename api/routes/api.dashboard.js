const express = require("express");
const router = express.Router();
const controller = require("../utils.js");
const auth = require("../utils/auth");
const con=require("../controller/other.js")
router.get("/getPHR", auth, controller.getPHR);
router.get("/others", con.fetchOtherProfiles);
module.exports = router;
