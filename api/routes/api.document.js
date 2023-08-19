const express = require("express");
const router = express.Router();
const controller = require('../controller/program.js')

router.post('/create', controller.createDocument)
router.post('/fetch', controller.fetchDocument)

module.exports = router