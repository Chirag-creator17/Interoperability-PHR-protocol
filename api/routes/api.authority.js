const express = require("express");
const router = express.Router();
const controller = require("../controller/program.js");
const auth = require("../utils/auth");

router.post("/authorise", auth, controller.authorise);
router.post("/revoke", auth, controller.revokeAuthorisation);
router.post("/fetch/onProfile", auth, controller.fetchAuthorityFromProfile);
router.post("/fetch/onAuthority", auth, controller.fetchAuthorityFromAuthorised);

module.exports = router;
