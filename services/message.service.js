const { messageDb } = require("../db");
const AWS = require("aws-sdk");
var comprehend = new AWS.Comprehend({ apiVersion: "2017-11-27" });

const createMessage = async (message) => {
  // call AWS Comprehend
  try {
    let params = {
      LanguageCode: "en",
      Text: message,
    };
    var sentimentData = await comprehend.detectSentiment(params).promise();
    console.log(sentimentData);
  } catch (err) {
    console.log("[SERVICE: ]", err.message);
  }
  if (sentimentData.Sentiment == "NEGATIVE") {
    return;
  }
  // call AWS Polly
  // call message database
  await messageDb.createMessage(message);
};

module.exports = {
  createMessage,
};
