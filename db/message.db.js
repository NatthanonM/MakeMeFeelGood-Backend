const AWS = require("aws-sdk");
const uuid = require("uuid");
const configs = require("../configs");

// Set the region
AWS.config.update({ region: configs.region });
// Create DynamoDB document client
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const createMessage = async (message) => {
  const utcTimestamp = new Date().getTime();
  var params = {
    TableName: configs.dynamodbTableName,
    Item: {
      id: uuid.v4(),
      text: message,
      created_at: utcTimestamp,
      upvote: 0,
      report_count: 0,
      voice_id: "",
    },
  };
  // Call DynamoDB to add the item to the table
  const data = await docClient.put(params).promise();
};

const messageDb = {
  createMessage,
};

module.exports = {
  messageDb,
};
