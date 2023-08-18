const express = require("express");
const router = express.Router();
const controller = require('../controller/program.js')

router.post('/create/:id', controller.createDocument)

module.exports = router