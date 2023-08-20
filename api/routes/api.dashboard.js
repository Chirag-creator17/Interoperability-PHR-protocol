const express = require("express");
const router = express.Router();
const controller = require("../utils.js");
const auth = require("../utils/auth");
const con = require("../controller/other.js");

router.get("/getPHR", auth, controller.getPHR);
router.get("/others",auth, con.fetchOtherProfiles);
router.post("/fetch/authorised",auth, con.fetchUserFromWalletController);

module.exports = router;
