const AWS = require("aws-sdk");
const uuid = require("uuid");
const configs = require("../configs");

AWS.config.update({ region: configs.region });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const createMessage = (message) => {
  const utcTimestamp = new Date().getTime();
  var params = {
    TableName: configs.dynamodbTableName,
    Item: {
      id: { S: uuid.v4() },
      text: { S: message },
      created_at: { N: utcTimestamp },
      upvote: { N: 0 },
      report_count: { N: 0 },
      voice_id: { S: "" },
    },
  };
  // Call DynamoDB to add the item to the table
  ddb.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
};

const messageDb = {
  createMessage,
};

module.exports = {
  messageDb,
};
