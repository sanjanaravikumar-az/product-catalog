import { Construct } from 'constructs';
import { CfnInclude } from 'aws-cdk-lib/cloudformation-include';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const branchName = process.env.AWS_BRANCH ?? 'sandbox';

export class CustomcfnCustomResource extends Construct {
  public readonly template: CfnInclude;

  constructor(scope: Construct, id: string, data?: any, auth?: any, functions?: any, storage?: any) {
    super(scope, id);

    this.template = new CfnInclude(this, 'Template', {
      templateFile: join(__dirname, 'template.json'),
      parameters: {
        env: branchName,
        apiproductcatalogGraphQLAPIKeyOutput: data?.resources.cfnResources.cfnGraphqlApi.attrApiKey ?? '',
        apiproductcatalogGraphQLAPIIdOutput: data?.resources.cfnResources.cfnGraphqlApi.attrApiId ?? '',
        apiproductcatalogGraphQLAPIEndpointOutput: data?.resources.cfnResources.cfnGraphqlApi.attrGraphQlUrl ?? '',
        authproductcatalog6e145452IdentityPoolId: auth?.resources.cfnResources.cfnIdentityPool.ref ?? '',
        authproductcatalog6e145452IdentityPoolName: auth?.resources.cfnResources.cfnIdentityPool.identityPoolName ?? '',
        authproductcatalog6e145452UserPoolId: auth?.resources.userPool.userPoolId ?? '',
        authproductcatalog6e145452UserPoolArn: auth?.resources.userPool.userPoolArn ?? '',
        authproductcatalog6e145452AppClientIDWeb: auth?.resources.userPoolClient.userPoolClientId ?? '',
        authproductcatalog6e145452AppClientID: auth?.resources.userPoolClient.userPoolClientId ?? '',
        functionlowstockproductcatalogName: functions?.lowstockproductcatalog?.resources.lambda.functionName ?? '',
        functionlowstockproductcatalogArn: functions?.lowstockproductcatalog?.resources.lambda.functionArn ?? '',
        functionlowstockproductcatalogRegion: 'us-east-1',
        functionlowstockproductcatalogLambdaExecutionRole: functions?.lowstockproductcatalog?.resources.lambda.role?.roleName ?? '',
        functionlowstockproductcatalogLambdaExecutionRoleArn: functions?.lowstockproductcatalog?.resources.lambda.role?.roleArn ?? '',
        storageproductimages3BucketName: storage?.resources.bucket.bucketName ?? '',
        storageproductimages3Region: 'us-east-1',
      },
    });
  }
}
