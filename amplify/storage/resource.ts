import { defineStorage } from "@aws-amplify/backend";

const branchName = process.env.AWS_BRANCH ?? "sandbox";

export const storage = defineStorage({ 
    // Use this bucket name post refactor
    // name: 'productimages3bucketbb5de-dev',
    name: `productimages3bucketbb5de-${branchName}`, access: allow => ({
        "public/*": [allow.authenticated.to(["write", "read", "delete"])],
        "protected/{entity_id}/*": [allow.authenticated.to(["write", "read", "delete"])],
        "private/{entity_id}/*": [allow.authenticated.to(["write", "read", "delete"])]
    }) });
