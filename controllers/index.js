const {
  postMessage,
  getMessages,
  upvoteMessage,
  reportMessage,
} = require("./message.controller");

const message = {
  postMessage,
  getMessages,
  upvoteMessage,
  reportMessage,
};

module.exports = {
  message,
};
