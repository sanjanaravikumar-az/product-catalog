import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { lowstockproductcatalog } from "./function/lowstockproductcatalog/resource";
import { defineBackend } from "@aws-amplify/backend";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { cdkStack as customProdInventory } from "./custom/customProdInventory/resource";
const backend = defineBackend({
    auth,
    data,
    storage,
    lowstockproductcatalog
});

// Connect function to data resource using Amplify's dependency system
backend.lowstockproductcatalog.addEnvironment("GRAPHQL_API_ID", backend.data.resources.graphqlApi.apiId);
backend.lowstockproductcatalog.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['appsync:GraphQL'],
    resources: [backend.data.resources.graphqlApi.arn + '/*']
  })
);
const userPool = backend.auth.resources.userPool;
const userPoolClient = userPool.addClient("NativeAppClient", {
    refreshTokenValidity: Duration.days(30),
    disableOAuth: true,
    enableTokenRevocation: true,
    enablePropagateAdditionalUserContextData: false,
    authSessionValidity: Duration.minutes(3),
    generateSecret: false
});

new customProdInventory(backend.createStack("customProdInventory"), "customProdInventory", {
    data: backend.data
});
