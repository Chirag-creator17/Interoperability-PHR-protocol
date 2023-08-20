const express = require("express");
const router = express.Router();
const controller = require("../controller/program.js");
const auth = require("../utils/auth");

router.post("/create", auth, controller.createProfile);
router.post("/update", auth, controller.updateProfile);
router.post("/fetch/info/id", auth, controller.fetchProfileInfoFromId);
router.post("/fetch/info/address", auth, controller.fetchProfileInfoFromAddres);

module.exports = router;
