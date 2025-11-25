import { defineFunction } from "@aws-amplify/backend";

const branchName = process.env.AWS_BRANCH ?? "sandbox";

export const lowStockAlert = defineFunction({
    entry: "./handler.ts",
    name: `lowStockAlert-${branchName}`,
    timeoutSeconds: 25,
    memoryMB: 128,
    environment: { 
        ENV: `${branchName}`, 
        REGION: "us-east-1",
        API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT: process.env.API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT || "",
        API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT: process.env.API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT || ""
    },
    runtime: 22
});
