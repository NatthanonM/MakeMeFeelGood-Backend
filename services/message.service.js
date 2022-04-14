const { messageDb } = require("../db");
const AWS = require("aws-sdk");
const configs = require("../configs");
var comprehend = new AWS.Comprehend({ apiVersion: "2017-11-27" });
var polly = new AWS.Polly({ apiVersion: "2016-06-10" });
var s3 = new AWS.S3({ apiVersion: "2006-03-01" });

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
  try {
    var params = {
      OutputFormat: "mp3",
      OutputS3BucketName: configs.S3BucketName,
      Text: message,
      VoiceId: "Joanna",
      Engine: "neural",
      LanguageCode: "en-US",
      OutputS3KeyPrefix: "voice/",
    };
    var speechSynthesisData = await polly
      .startSpeechSynthesisTask(params)
      .promise();
    console.log(speechSynthesisData);
  } catch (err) {
    console.log(err, err.stack);
  }

  // call message database
  await messageDb.createMessage(
    message,
    speechSynthesisData.SynthesisTask.TaskId
  );
};

const getMessages = async (timestamp) => {
  // get message from databast
  var messages = await messageDb.getMessage(timestamp);
  var messages = messages.map((message) => {
    var params = {
      Bucket: `${configs.S3BucketName}/voice`,
      Key: `.${message.voice_id}.mp3`,
    };
    var url = s3.getSignedUrl("getObject", params);
    message.url = url;
    return message;
  });
  return messages;
};

module.exports = {
  createMessage,
  getMessages,
};
