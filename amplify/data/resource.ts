import { defineData } from "@aws-amplify/backend";

const schema = `# Multi-user Product Catalog with IAM-based Role Access Control

enum UserRole {
  ADMIN
  MANAGER
  VIEWER
}

type User @model @auth(rules: [
  { allow: private, provider: iam },
  { allow: owner, ownerField: "id" }
]) {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type Product @model @auth(rules: [
  { allow: private, provider: iam },
  { allow: public, provider: apiKey, operations: [read] }
]) {
  id: ID!
  serialno: Int!
  engword: String!
  price: Float
  category: String
  description: String
  stock: Int
  brand: String
  imageKey: String
  images: [String]
  createdBy: String
  updatedBy: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
  comments: [Comment] @hasMany(indexName: "byProduct", fields: ["id"])
}

type Comment @model @auth(rules: [
  { allow: private, provider: iam },
  { allow: owner, ownerField: "authorId" }
]) {
  id: ID!
  productId: ID! @index(name: "byProduct")
  product: Product @belongsTo(fields: ["productId"])
  authorId: String!
  authorName: String!
  content: String!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type LowStockProduct {
  name: String!
  stock: Int!
}

type LowStockResponse {
  message: String!
  lowStockProducts: [LowStockProduct!]!
}

type Query {
  checkLowStock: LowStockResponse @function(name: "lowstockproductcatalog-\${env}") @auth(rules: [
    { allow: private, provider: iam },
    { allow: public, provider: apiKey }
  ])
}

`;

export const data = defineData({
    migratedAmplifyGen1DynamoDbTableMappings: [{
            //The "branchname" variable needs to be the same as your deployment branch if you want to reuse your Gen1 app tables
            branchName: "dev",
            modelNameToTableNameMapping: { User: "User-o6qp6hki3zcrtmddjkn3ql23ji-dev", Product: "Product-o6qp6hki3zcrtmddjkn3ql23ji-dev", Comment: "Comment-o6qp6hki3zcrtmddjkn3ql23ji-dev" }
        }],
    authorizationModes: {
        defaultAuthorizationMode: "iam",
        apiKeyAuthorizationMode: {
            expiresInDays: 365
        }
    },
    schema
});
