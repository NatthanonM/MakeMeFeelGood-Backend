const { messageDb } = require("../db");
const AWS = require("aws-sdk");
const configs = require("../configs");
var comprehend = new AWS.Comprehend({ apiVersion: "2017-11-27" });
var polly = new AWS.Polly({ apiVersion: "2016-06-10" });
var s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const createMessage = async (
  text,
  stratOfDayTimestamp = new Date().setUTCHours(0, 0, 0, 0)
) => {
  // find message message of today for checking duplication
  const start = new Date(stratOfDayTimestamp);
  const stop = date.setDate(date.getDate() + 1);
  var todayRecords = await messageDb.findMessage(text, start, stop);
  if (todayRecords.Count != 0) {
    throw new Error("duplicated message");
  }
  // get message from database for checking duplication
  var record = await messageDb.findMessage(text);
  if (record.Count == 0) {
    // call AWS Comprehend
    try {
      let params = {
        LanguageCode: "en",
        Text: text,
      };
      var sentimentData = await comprehend.detectSentiment(params).promise();
      // console.log(sentimentData);
    } catch (err) {
      console.log("[SERVICE: ]", err.message);
    }
    if (sentimentData.Sentiment == "NEGATIVE") {
      throw new Error("negative");
    }
    // call AWS Polly
    try {
      var voiceIds = ["Salli", "Ivy", "Kevin", "Justin", "Kimberly"];
      var randVoiceId = voiceIds[text.length % 5];
      var params = {
        OutputFormat: "mp3",
        OutputS3BucketName: configs.S3BucketName,
        Text: text,
        VoiceId: randVoiceId,
        Engine: "neural",
        LanguageCode: "en-US",
        OutputS3KeyPrefix: "voice/",
      };
      var speechSynthesisData = await polly
        .startSpeechSynthesisTask(params)
        .promise();
      // console.log(speechSynthesisData);
      var voice_id = speechSynthesisData.SynthesisTask.TaskId;
    } catch (err) {
      console.log(err, err.stack);
    }
  } else {
    var voice_id = record.Items[0].voice_id;
  }

  // call message database
  var res = await messageDb.createMessage(text, voice_id);
  var params = {
    Bucket: `${configs.S3BucketName}/voice`,
    Key: `.${res.voice_id}.mp3`,
  };
  var url = s3.getSignedUrl("getObject", params);
  res.url = url;
  delete res.voice_id;
  return res;
};

const getMessages = async (timestamp) => {
  // get message from databast
  var messages = await messageDb.getMessages(timestamp);
  var messages = messages
    .filter((message) => {
      return message.report_count < 10;
    })
    .map((message) => {
      var params = {
        Bucket: `${configs.S3BucketName}/voice`,
        Key: `.${message.voice_id}.mp3`,
      };
      var url = s3.getSignedUrl("getObject", params);
      message.url = url;
      delete message.voice_id;
      return message;
    });
  return messages;
};

const upvoteMessage = async (id) => {
  // get message from database
  var message = await messageDb.getMessage(id);
  // upvote message
  var { created_at } = message;
  await messageDb.upvoteMessage(id, created_at);
};

const reportMessage = async (id) => {
  // get message from database
  var message = await messageDb.getMessage(id);
  // report message
  var { created_at } = message;
  await messageDb.reportMessage(id, created_at);
};

module.exports = {
  createMessage,
  getMessages,
  upvoteMessage,
  reportMessage,
};
