const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
}

type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    status: String
    posts: [Post!]!
}

input UserInput {
    email: String!
    name: String!
    password: String!
}

type Mutation {
    createUser(userInput: UserInput): User!
}

type RootQuery {
    hello: String
}

schema {
    query: RootQuery
    mutation: Mutation
}`);
