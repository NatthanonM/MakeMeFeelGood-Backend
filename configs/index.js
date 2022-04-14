require("dotenv").config();

const configs = {
  port: process.env.PORT || 3000,
  region: process.env.REGION || "",
  dynamodbTableName: process.env.DYNAMODB_TABLE_NAME || "",
};

module.exports = configs;
