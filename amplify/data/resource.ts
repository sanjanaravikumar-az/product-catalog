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
  { allow: private, provider: iam }
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
`;

export const data = defineData({
    migratedAmplifyGen1DynamoDbTableMappings: [{
            //The "branchname" variable needs to be the same as your deployment branch if you want to reuse your Gen1 app tables
            branchName: "migrate",
            modelNameToTableNameMapping: { User: "User-5q72oqaztrebfhzn2fwfx2t2re-migrate", Product: "Product-5q72oqaztrebfhzn2fwfx2t2re-migrate", Comment: "Comment-5q72oqaztrebfhzn2fwfx2t2re-migrate" }
        }],
    authorizationModes: {
        defaultAuthorizationMode: "iam",
        apiKeyAuthorizationMode: { expiresInDays: 365 }
    },
    schema
});
