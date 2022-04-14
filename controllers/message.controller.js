const { messageService } = require("../services");

const postMessage = async (req, res, next) => {
  const { message } = req.body;
  // call message service
  try {
    await messageService.createMessage(message);
    res.sendStatus(201);
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

module.exports = {
  postMessage,
};
