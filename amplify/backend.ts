import { RemovalPolicy, Tags } from "aws-cdk-lib";
import { CfnResource } from "aws-cdk-lib";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { lowStockAlert } from "./function/lowStockAlert/resource";
import { defineBackend } from "@aws-amplify/backend";
import ci from "ci-info";
import { Duration } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";


const backend = defineBackend({
    auth,
    data,
    storage,
    lowStockAlert
});
const cfnUserPool = backend.auth.resources.cfnResources.cfnUserPool;
cfnUserPool.usernameAttributes = ["email"];
cfnUserPool.policies = {
    passwordPolicy: {
        minimumLength: 8,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
        requireUppercase: false,
        temporaryPasswordValidityDays: 7
    }
};
const cfnIdentityPool = backend.auth.resources.cfnResources.cfnIdentityPool;
cfnIdentityPool.allowUnauthenticatedIdentities = false;
const userPool = backend.auth.resources.userPool;
const userPoolClient = userPool.addClient("NativeAppClient", {
    disableOAuth: true,
    authSessionValidity: Duration.minutes(3),
    userPoolClientName: "produc6e145452_app_client",
    enablePropagateAdditionalUserContextData: false,
    enableTokenRevocation: true,
    refreshTokenValidity: Duration.days(30),
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
// changing cloudformation template to match deletionprotection: false setting in dynamoDB tables;
const cfnResources = backend.data.node.findAll().filter(c => CfnResource.isCfnResource(c));
for (const resource of cfnResources) {
    if (resource.cfnResourceType === "Custom::ImportedAmplifyDynamoDBTable") {
        resource.addPropertyOverride("deletionProtectionEnabled", false);
    }
}
// Tags.of(backend.stack).add("gen1-migrated-app", "true");
