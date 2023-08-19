const express = require("express");
const router = express.Router();
const controller = require('../controller/program.js')

router.post('/authorise', controller.authorise)
router.post('/revoke',controller.revokeAuthorisation)
router.post('/fetch/onProfile', controller.fetchAuthorityFromProfile)
router.post('/fetch/onAuthority', controller.fetchAuthorityFromAuthorised)

module.exports = router