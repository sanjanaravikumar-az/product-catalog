import * as cdk from 'aws-cdk-lib';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

export class cdkStack extends cdk.Stack {
constructor(scope: Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
super(scope, id, props);

new cdk.CfnParameter(this, 'env', {
type: 'String',
description: 'Current Amplify CLI env name',
});

const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();

const amplifyResources: AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(
this as any,
amplifyResourceProps!.category,
amplifyResourceProps!.resourceName,
      [
        { category: 'auth', resourceName: 'productcatalog6e145452' },
        { category: 'api', resourceName: 'productcatalog' },
        { category: 'storage', resourceName: 'productimages3' },
        { category: 'function', resourceName: 'lowstockproductcatalog' }
      ]
);

    // Resource references
    const userPoolId = amplifyResources.auth.productcatalog6e145452.UserPoolId;
    const graphqlApiId = amplifyResources.api.productcatalog.GraphQLAPIIdOutput;
    const graphqlEndpoint = amplifyResources.api.productcatalog.GraphQLAPIEndpointOutput;
    const graphqlApiKey = amplifyResources.api.productcatalog.GraphQLAPIKeyOutput;
    const bucketName = (amplifyResources as any).storage?.productimages3?.BucketName || `productimages3-${cdk.Fn.ref('env')}`;
    const functionArn = amplifyResources.function.lowstockproductcatalog.Arn;

const topic = new sns.Topic(this, 'InventoryAlertTopic', {
topicName: `inventory-alerts-${amplifyProjectInfo.projectName}-${cdk.Fn.ref('env')}`
});

const inventoryChecker = new lambda.Function(this, 'InventoryChecker', {
functionName: `inventory-checker-${amplifyProjectInfo.projectName}-${cdk.Fn.ref('env')}`,
runtime: lambda.Runtime.NODEJS_18_X,
handler: 'index.handler',
timeout: cdk.Duration.seconds(30),
code: lambda.Code.fromInline(`
const { PublishCommand, SNSClient } = require('@aws-sdk/client-sns');
const https = require('https');
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

exports.handler = async () => {
 const products = await fetchProducts();
 const lowStock = products.filter(p => p.stock !== null && p.stock < 5);
 
 if (lowStock.length > 0) {
   const message = \`Low Stock Alert: \${lowStock.length} products need restocking\`;
   
   await snsClient.send(new PublishCommand({
     TopicArn: process.env.SNS_TOPIC_ARN,
     Subject: 'Inventory Alert',
     Message: message
   }));
 }
 
 return { statusCode: 200, lowStockCount: lowStock.length };
};

async function fetchProducts() {
 return new Promise((resolve, reject) => {
   const query = 'query ListProducts { listProducts { items { id engword stock } } }';
   const postData = JSON.stringify({ query });
   const url = new URL(process.env.GRAPHQL_ENDPOINT);
   
   const req = https.request({
     hostname: url.hostname,
     port: 443,
     path: url.pathname,
     method: 'POST',
     headers: {
       'content-type': 'application/json',
       'x-api-key': process.env.GRAPHQL_API_KEY,
       'Content-Length': Buffer.byteLength(postData)
     }
   }, (res) => {
     let data = '';
     res.on('data', (chunk) => data += chunk);
     res.on('end', () => {
       const response = JSON.parse(data);
       resolve(response.data?.listProducts?.items || []);
     });
   });
   
   req.on('error', reject);
   req.write(postData);
   req.end();
 });
}
     `),
environment: {
SNS_TOPIC_ARN: topic.topicArn,
        GRAPHQL_ENDPOINT: graphqlEndpoint,
        GRAPHQL_API_KEY: graphqlApiKey,
        USER_POOL_ID: userPoolId,
        BUCKET_NAME: bucketName,
        FUNCTION_ARN: functionArn
}
});

const emailNotifier = new lambda.Function(this, 'EmailNotifier', {
functionName: `email-notifier-${amplifyProjectInfo.projectName}-${cdk.Fn.ref('env')}`,
runtime: lambda.Runtime.NODEJS_18_X,
handler: 'index.handler',
code: lambda.Code.fromInline(`
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const sesClient = new SESClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
 for (const record of event.Records) {
   const { Subject, Message } = record.Sns;
   
   await sesClient.send(new SendEmailCommand({
     Source: process.env.SOURCE_EMAIL,
     Destination: { ToAddresses: [process.env.ADMIN_EMAIL] },
     Message: {
       Subject: { Data: Subject },
       Body: { Text: { Data: Message } }
     }
   }));
 }
};
     `),
environment: {
SOURCE_EMAIL: 'noreply@example.com',
ADMIN_EMAIL: 'admin@example.com'
}
});

topic.addSubscription(new subs.LambdaSubscription(emailNotifier));

const rule = new events.Rule(this, 'DailyInventoryCheck', {
schedule: events.Schedule.cron({ minute: '0', hour: '9' })
});
rule.addTarget(new targets.LambdaFunction(inventoryChecker));

topic.grantPublish(inventoryChecker);
emailNotifier.addToRolePolicy(new iam.PolicyStatement({
actions: ['ses:SendEmail', 'ses:SendRawEmail'],
resources: ['*']
}));

new cdk.CfnOutput(this, 'InventoryAlertTopicArn', {
value: topic.topicArn,
description: 'SNS Topic ARN for inventory alerts'
});

new cdk.CfnOutput(this, 'InventoryCheckerFunctionName', {
value: inventoryChecker.functionName,
description: 'Lambda function that checks inventory levels'
});

    new cdk.CfnOutput(this, 'UserPoolIdRef', {
      value: userPoolId,
      description: 'Cognito User Pool ID'
    });

    new cdk.CfnOutput(this, 'GraphQLApiIdRef', {
      value: graphqlApiId,
      description: 'AppSync GraphQL API ID'
    });

    new cdk.CfnOutput(this, 'StorageBucketRef', {
      value: bucketName,
      description: 'S3 Storage Bucket Name'
    });

    new cdk.CfnOutput(this, 'LowStockFunctionRef', {
      value: functionArn,
      description: 'Low Stock Lambda Function ARN'
    });
}
}