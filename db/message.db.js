const AWS = require("aws-sdk");
const uuid = require("uuid");
const configs = require("../configs");

// Set the region
AWS.config.update({ region: configs.region });
// Create DynamoDB document client
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

const createMessage = async (message, voice_id) => {
  const utcTimestamp = new Date().getTime();
  var id = uuid.v4();
  var params = {
    TableName: configs.dynamodbTableName,
    Item: {
      id: id,
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
  var res = {
    id: id,
    text: message,
    upvote: 0,
    voice_id: voice_id,
    created_at: utcTimestamp,
  };
  return res;
};

const getMessages = async (start) => {
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
        "#CA": "created_at",
      },
      ExpressionAttributeValues: {
        ":start": start,
        ":stop": stop,
      },
      FilterExpression: "created_at >= :start AND created_at < :stop",
      ProjectionExpression: "#ID, #T, #UV, #VI, #CA",
    };
    var data = await docClient.scan(params).promise();
    var sortedItems = data.Items.sort((a, b) => {
      if (a.upvote === b.upvote) {
        return b.created_at - a.created_at;
      }
      return b.upvote - a.upvote;
    });
  } catch (err) {
    console.log("[DB]: ", err, err.stack);
  }
  return sortedItems;
};

const getMessage = async (id) => {
  var params = {
    TableName: configs.dynamodbTableName,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id,
    },
  };
  try {
    var data = await docClient.query(params).promise();
    if (data.Items.length == 0) throw { message: "Item not found" };
    return data.Items[0];
  } catch (err) {
    console.log("[DB]: ", err.message);
  }
};

const upvoteMessage = async (id, created_at) => {
  var params = {
    TableName: configs.dynamodbTableName,
    Key: {
      id: id,
      created_at: created_at,
    },
    UpdateExpression: "set upvote = upvote + :upvote",
    ExpressionAttributeValues: {
      ":upvote": 1,
    },
  };

  try {
    await docClient.update(params).promise();
  } catch (err) {
    console.log("[DB]: ", err.message);
  }
};

const reportMessage = async (id, created_at) => {
  var params = {
    TableName: configs.dynamodbTableName,
    Key: {
      id: id,
      created_at: created_at,
    },
    UpdateExpression: "set report_count = report_count + :report_count",
    ExpressionAttributeValues: {
      ":report_count": 1,
    },
  };

  try {
    await docClient.update(params).promise();
  } catch (err) {
    console.log("[DB]: ", err.message);
  }
};

const findMessage = async (message, start = null, stop = null) => {
  try {
    if (start || stop) {
      var params = {
        TableName: configs.dynamodbTableName,
        ExpressionAttributeNames: {
          "#ID": "id",
          "#T": "text",
          "#UV": "upvote",
          "#VI": "voice_id",
        },
        ExpressionAttributeValues: {
          ":message": message,
          ":start": start,
          ":stop": stop,
        },
        FilterExpression:
          "#T = :message AND created_at >= :start AND created_at < :stop",
        ProjectionExpression: "#ID, #T, #UV, #VI",
      };
    } else {
      var params = {
        TableName: configs.dynamodbTableName,
        ExpressionAttributeNames: {
          "#ID": "id",
          "#T": "text",
          "#UV": "upvote",
          "#VI": "voice_id",
        },
        ExpressionAttributeValues: {
          ":message": message,
        },
        FilterExpression: "#T = :message",
        ProjectionExpression: "#ID, #T, #UV, #VI",
      };
    }

    var data = await docClient.scan(params).promise();
  } catch (err) {
    console.log("[DB]: ", err, err.stack);
  }
  return data;
};

const messageDb = {
  createMessage,
  getMessages,
  getMessage,
  upvoteMessage,
  reportMessage,
  findMessage,
};

module.exports = {
  messageDb,
};
