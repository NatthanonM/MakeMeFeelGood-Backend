const { postMessage, getMessages } = require("./message.controller");

const message = {
  postMessage,
  getMessages,
};

module.exports = {
  message,
};
