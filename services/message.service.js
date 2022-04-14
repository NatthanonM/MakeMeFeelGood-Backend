const { messageDb } = require("../db");

const createMessage = async (message) => {
  // call AWS Semtiment
  // call AWS Polly
  // call message database
  await messageDb.createMessage(message);
};

module.exports = {
  createMessage,
};
