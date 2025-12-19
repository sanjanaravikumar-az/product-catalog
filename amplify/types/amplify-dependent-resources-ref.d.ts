export type AmplifyDependentResourcesAttributes = {
  "api": {
    "productcatalog": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    }
  },
  "auth": {
    "productcatalog6e145452": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "custom": {
    "customProdInventory": {
      "InventoryAlertTopicArn": "string",
      "InventoryCheckerFunctionName": "string"
    }
  },
  "function": {
    "lowstockproductcatalog": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "productimages3": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}