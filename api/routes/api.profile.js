const express = require("express");
const router = express.Router();
const controller = require('../controller/program.js')

router.post('/create', controller.createProfile)
router.post('/update', controller.updateProfile)

module.exports = router