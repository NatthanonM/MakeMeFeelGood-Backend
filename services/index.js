const { createMessage, getMessages } = require("./message.service");

const messageService = {
  createMessage,
  getMessages,
};

module.exports = {
  messageService,
};
