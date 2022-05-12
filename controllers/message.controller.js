const { messageService } = require("../services");

const postMessage = async (req, res, next) => {
  const { message } = req.body;
  // call message service
  try {
    var id = await messageService.createMessage(message);
    res.status(201).json({ id });
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

const getMessages = async (req, res, next) => {
  const { timestamp } = req.params;
  // call message service
  try {
    var messages = await messageService.getMessages(parseInt(timestamp));
    res.status(200).json(messages);
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

const upvoteMessage = async (req, res, next) => {
  const { id } = req.params;
  try {
    await messageService.upvoteMessage(id);
    res.sendStatus(204);
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

const reportMessage = async (req, res, next) => {
  const { id } = req.params;
  try {
    await messageService.reportMessage(id);
    res.sendStatus(204);
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

module.exports = {
  postMessage,
  getMessages,
  upvoteMessage,
  reportMessage,
};
