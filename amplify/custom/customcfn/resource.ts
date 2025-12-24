import { Construct } from 'constructs';
import { CfnInclude } from 'aws-cdk-lib/cloudformation-include';
import * as path from 'path';

const branchName = process.env.AWS_BRANCH ?? 'sandbox';

export class CustomcfnCustomResource extends Construct {
  public readonly template: CfnInclude;

  constructor(scope: Construct, id: string, data?: any, auth?: any, functions?: any, storage?: any, custom?: any) {
    super(scope, id);

    this.template = new CfnInclude(this, 'Template', {
      templateFile: path.join(__dirname, 'template.json'),
      parameters: {
        env: branchName,
        apiproductcatalogGraphQLAPIKeyOutput: data?.resources.cfnResources.cfnGraphqlApi.attrApiKey,
        apiproductcatalogGraphQLAPIIdOutput: data?.resources.cfnResources.cfnGraphqlApi.attrApiId,
        apiproductcatalogGraphQLAPIEndpointOutput: data?.resources.cfnResources.cfnGraphqlApi.attrGraphQlUrl,
        authproductcatalog6e145452IdentityPoolId: auth?.resources.identityPool.identityPoolId,
        authproductcatalog6e145452IdentityPoolName: auth?.resources.identityPool.identityPoolName,
        authproductcatalog6e145452UserPoolId: auth?.resources.userPool.userPoolId,
        authproductcatalog6e145452UserPoolArn: auth?.resources.userPool.userPoolArn,
        authproductcatalog6e145452AppClientIDWeb: auth?.resources.userPoolClient.userPoolClientId,
        authproductcatalog6e145452AppClientID: auth?.resources.userPoolClient.userPoolClientId,
        customcustomProdInventoryInventoryAlertTopicArn: custom?.template.getOutput('ProdInventoryInventoryAlertTopicArn').value,
        customcustomProdInventoryInventoryCheckerFunctionName: custom?.template.getOutput('ProdInventoryInventoryCheckerFunctionName').value,
        customcustomProdInventoryUserPoolIdRef: custom?.template.getOutput('ProdInventoryUserPoolIdRef').value,
        customcustomProdInventoryGraphQLApiIdRef: custom?.template.getOutput('ProdInventoryGraphQLApiIdRef').value,
        customcustomProdInventoryStorageBucketRef: custom?.template.getOutput('ProdInventoryStorageBucketRef').value,
        customcustomProdInventoryLowStockFunctionRef: custom?.template.getOutput('ProdInventoryLowStockFunctionRef').value,
        functionlowstockproductcatalogName: functions?.resources.lambda.functionName,
        functionlowstockproductcatalogArn: functions?.resources.lambda.functionArn,
        functionlowstockproductcatalogRegion: functions?.resources.lambda.env.region,
        functionlowstockproductcatalogLambdaExecutionRole: functions?.resources.lambda.role?.roleName,
        functionlowstockproductcatalogLambdaExecutionRoleArn: functions?.resources.lambda.functionArn,
        storageproductimages3BucketName: storage?.resources.bucket.bucketName,
        storageproductimages3Region: storage?.resources.bucket.env.region,
      },
    });
  }
}
