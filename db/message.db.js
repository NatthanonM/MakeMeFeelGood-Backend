const AWS = require("aws-sdk");
const uuid = require("uuid");
const configs = require("../configs");

// Set the region
AWS.config.update({ region: configs.region });
// Create DynamoDB document client
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const createMessage = async (message, voice_id) => {
  const utcTimestamp = new Date().getTime();
  var params = {
    TableName: configs.dynamodbTableName,
    Item: {
      id: uuid.v4(),
      text: message,
      created_at: utcTimestamp,
      upvote: 0,
      report_count: 0,
      voice_id: voice_id,
    },
  };
  // Call DynamoDB to add the item to the table
  try {
    await docClient.put(params).promise();
  } catch (err) {
    console.log("[DB]: ", err.message);
  }
};

const getMessage = async (start) => {
  const date = new Date(start);
  const stop = date.setDate(date.getDate() + 1);
  try {
    var params = {
      TableName: configs.dynamodbTableName,
      ExpressionAttributeNames: {
        "#ID": "id",
        "#T": "text",
        "#UV": "upvote",
        "#VI": "voice_id",
      },
      ExpressionAttributeValues: {
        ":start": start,
        ":stop": stop,
      },
      FilterExpression: "created_at >= :start AND created_at < :stop",
      ProjectionExpression: "#ID, #T, #UV, #VI",
    };
    var data = await docClient.scan(params).promise();
    var sortedItems = data.Items.sort((a, b) => b.upvote - a.upvote);
  } catch (err) {
    console.log("[DB]: ", err, err.stack);
  }
  return sortedItems;
};

const messageDb = {
  createMessage,
  getMessage,
};

module.exports = {
  messageDb,
};
