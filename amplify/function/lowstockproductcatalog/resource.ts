import { defineFunction } from "@aws-amplify/backend";

const branchName = process.env.AWS_BRANCH ?? "sandbox";

export const lowstockproductcatalog = defineFunction({
    entry: "./handler.ts",
    timeoutSeconds: 25,
    memoryMB: 128,
    environment: { API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT: "da2-3b4yvell4vawtgyoud3iofljna", API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT: "https://skzwtclsircsjeian43ekmlnxy.appsync-api.us-east-1.amazonaws.com/graphql", API_PRODUCTCATALOG_GRAPHQLAPIIDOUTPUT: "o6qp6hki3zcrtmddjkn3ql23ji", AUTH_PRODUCTCATALOG6E145452_USERPOOLID: "us-east-1_B8NtLkXyd", ENV: `${branchName}`, REGION: "us-east-1" },
    runtime: 22,
    schedule: "every day"
});
