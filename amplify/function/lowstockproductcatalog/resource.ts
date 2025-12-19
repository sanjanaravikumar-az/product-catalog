import { defineFunction } from "@aws-amplify/backend";

export const lowstockproductcatalog = defineFunction({
    entry: "./handler.ts",
    timeoutSeconds: 25,
    memoryMB: 128,
    runtime: 22
});
