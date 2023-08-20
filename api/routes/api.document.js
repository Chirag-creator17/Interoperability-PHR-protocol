const express = require("express");
const router = express.Router();
const controller = require("../controller/program.js");
const auth = require("../utils/auth");

router.post("/create", auth, controller.createDocument);
router.post("/fetch", auth, controller.fetchDocument);

module.exports = router;
