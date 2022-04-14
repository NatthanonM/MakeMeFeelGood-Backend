const express = require("express");
const { message } = require("../controllers");

const router = express.Router();

router.post("/message", message.postMessage);
router.get("/message/:timestamp", message.getMessages);

module.exports = router;
