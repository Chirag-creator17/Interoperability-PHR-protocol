const express = require("express");
const router = express.Router();
const controller = require('../controller/program.js')

router.post('/create', controller.createProfile)
router.post('/update', controller.updateProfile)
router.post('/fetch/info/id', controller.fetchProfileInfoFromId)
router.post('/fetch/info/address', controller.fetchProfileInfoFromAddres)

module.exports = router