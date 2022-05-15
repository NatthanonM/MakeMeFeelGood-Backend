const configs = {
  port: process.env.PORT || 3000,
  region: process.env.REGION || "",
  S3BucketName: process.env.S3_BUCKET_NAME || "",
  dynamodbTableName: process.env.DYNAMODB_TABLE_NAME || "",
  origin: process.env.ORIGIN || "",
};

module.exports = configs;
