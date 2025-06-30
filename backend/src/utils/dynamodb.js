const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

class DynamoDBService {
  constructor() {
    this.dynamodb = dynamodb;
  }

  async get(tableName, key) {
    try {
      const result = await this.dynamodb.get({
        TableName: tableName,
        Key: key
      }).promise();
      
      return result.Item;
    } catch (error) {
      console.error('DynamoDB Get Error:', error);
      throw error;
    }
  }

  async put(tableName, item) {
    try {
      await this.dynamodb.put({
        TableName: tableName,
        Item: item
      }).promise();
      
      return item;
    } catch (error) {
      console.error('DynamoDB Put Error:', error);
      throw error;
    }
  }

  async update(tableName, key, updateExpression, expressionAttributeValues, expressionAttributeNames = {}) {
    try {
      const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      if (Object.keys(expressionAttributeNames).length > 0) {
        params.ExpressionAttributeNames = expressionAttributeNames;
      }

      const result = await this.dynamodb.update(params).promise();
      return result.Attributes;
    } catch (error) {
      console.error('DynamoDB Update Error:', error);
      throw error;
    }
  }

  async query(tableName, keyConditionExpression, expressionAttributeValues, indexName = null) {
    try {
      const params = {
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
      };

      if (indexName) {
        params.IndexName = indexName;
      }

      const result = await this.dynamodb.query(params).promise();
      return result.Items;
    } catch (error) {
      console.error('DynamoDB Query Error:', error);
      throw error;
    }
  }

  async scan(tableName, filterExpression = null, expressionAttributeValues = {}) {
    try {
      const params = {
        TableName: tableName
      };

      if (filterExpression) {
        params.FilterExpression = filterExpression;
        params.ExpressionAttributeValues = expressionAttributeValues;
      }

      const result = await this.dynamodb.scan(params).promise();
      return result.Items;
    } catch (error) {
      console.error('DynamoDB Scan Error:', error);
      throw error;
    }
  }

  async delete(tableName, key) {
    try {
      await this.dynamodb.delete({
        TableName: tableName,
        Key: key
      }).promise();
      
      return true;
    } catch (error) {
      console.error('DynamoDB Delete Error:', error);
      throw error;
    }
  }
}

module.exports = new DynamoDBService();