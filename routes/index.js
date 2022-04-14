const express = require("express");
const { message } = require("../controllers");

const router = express.Router();

router.post("/message", message.postMessage);

module.exports = router;
