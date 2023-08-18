const express = require("express");
const router = express.Router();
const controller = require('../controller/program.js')

router.post('/create/:id', controller.createProfile)
router.post('/update/:id', controller.updateProfile)

module.exports = router