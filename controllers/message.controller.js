const { messageService } = require("../services");

const postMessage = async (req, res, next) => {
  const { message: text } = req.body;
  // call message service
  try {
    var message = await messageService.createMessage(text);
    res.status(201).json(message);
    next();
  } catch (e) {
    if (e.message === "duplicated message") {
      res.sendStatus(409);
      return;
    } else if (e.message === "negative") {
      res.sendStatus(400);
      return;
    } else {
      console.log(e.message);
      res.sendStatus(500) && next(e);
    }
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
