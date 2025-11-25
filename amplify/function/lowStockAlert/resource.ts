import { defineFunction } from "@aws-amplify/backend";

throw new Error("Source code for this function can be found in your Amplify Gen 1 Directory. See .amplify/migration/amplify/backend/function/lowStockAlert/src");
const branchName = process.env.AWS_BRANCH ?? "sandbox";

export const lowStockAlert = defineFunction({
    entry: "./handler.ts",
    name: `lowStockAlert-${branchName}`,
    timeoutSeconds: 25,
    memoryMB: 128,
    environment: { ENV: `${branchName}`, REGION: "us-east-1" },
    runtime: 22
});
