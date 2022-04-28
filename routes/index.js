const express = require("express");
const { message } = require("../controllers");

const router = express.Router();

router.post("/message", message.postMessage);
router.get("/message/:timestamp", message.getMessages);
router.patch("/message/upvote/:id", message.upvoteMessage);
router.patch("/message/report/:id", message.reportMessage);

module.exports = router;
