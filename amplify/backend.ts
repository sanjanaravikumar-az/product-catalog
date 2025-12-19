import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { lowstockproductcatalog } from "./function/lowstockproductcatalog/resource";
import { defineBackend } from "@aws-amplify/backend";
import { Duration } from "aws-cdk-lib";
import { cdkStack as customProdInventory } from "./custom/customProdInventory/resource";
const backend = defineBackend({
    auth,
    data,
    storage,
    lowstockproductcatalog
});

// Connect function to data resource
backend.lowstockproductcatalog.addEnvironment("API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT", backend.data.resources.cfnResources.cfnGraphqlApi.attrGraphQlUrl);
backend.lowstockproductcatalog.addEnvironment("API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT", backend.data.resources.cfnResources.cfnApiKey!.attrApiKey);
backend.lowstockproductcatalog.addEnvironment("API_PRODUCTCATALOG_GRAPHQLAPIIDOUTPUT", backend.data.resources.graphqlApi.apiId);
backend.lowstockproductcatalog.addEnvironment("AUTH_PRODUCTCATALOG6E145452_USERPOOLID", backend.auth.resources.userPool.userPoolId);
backend.lowstockproductcatalog.addEnvironment("ENV", "main");
backend.lowstockproductcatalog.addEnvironment("REGION", "us-east-1");
const cfnUserPool = backend.auth.resources.cfnResources.cfnUserPool;
cfnUserPool.usernameAttributes = ["email"];
cfnUserPool.policies = {
    passwordPolicy: {
        minimumLength: 8,
        requireUppercase: false,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
        temporaryPasswordValidityDays: 7
    }
};
const cfnIdentityPool = backend.auth.resources.cfnResources.cfnIdentityPool;
cfnIdentityPool.allowUnauthenticatedIdentities = false;
const userPool = backend.auth.resources.userPool;
const userPoolClient = userPool.addClient("NativeAppClient", {
    refreshTokenValidity: Duration.days(30),
    disableOAuth: true,
    enableTokenRevocation: true,
    enablePropagateAdditionalUserContextData: false,
    authSessionValidity: Duration.minutes(3),
    generateSecret: false
});
const s3Bucket = backend.storage.resources.cfnResources.cfnBucket;
s3Bucket.bucketEncryption = {
    serverSideEncryptionConfiguration: [
        {
            serverSideEncryptionByDefault: {
                sseAlgorithm: "AES256"
            },
            bucketKeyEnabled: false
        }
    ]
};
new customProdInventory(backend.createStack("customProdInventory"), "customProdInventory", {
    data: backend.data
});
