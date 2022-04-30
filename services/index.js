const {
  createMessage,
  getMessages,
  upvoteMessage,
  reportMessage,
} = require("./message.service");

const messageService = {
  createMessage,
  getMessages,
  upvoteMessage,
  reportMessage,
};

module.exports = {
  messageService,
};
