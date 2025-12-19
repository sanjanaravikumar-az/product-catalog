import { defineFunction } from "@aws-amplify/backend";

export const lowstockproductcatalog = defineFunction({
    entry: "./handler.ts",
    timeoutSeconds: 25,
    memoryMB: 128,
    environment: { API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT: "da2-luiopcy65nde3cf5eqflqwlhvy", API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT: "https://xdlo4oa7kjbufgtnczmdhzmdma.appsync-api.us-east-1.amazonaws.com/graphql", API_PRODUCTCATALOG_GRAPHQLAPIIDOUTPUT: "q3bnmmb6p5fbhlqbljf4yexsdq", AUTH_PRODUCTCATALOG6E145452_USERPOOLID: "us-east-1_85iAHQaeM", ENV: "main", REGION: "us-east-1" },
    runtime: 22
});
