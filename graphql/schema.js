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

input PostInput {
    title: String!
    content: String!
    imageUrl: String!
}

type AuthData {
    token: String!
    userId: String!

}

type PostData {
    posts: [Post!]!
    totalPosts: Int!
}

type Mutation {
    createUser(userInput: UserInput): User!
    createPost(postInput: PostInput): Post!
    updatePost(id: ID!, postInput: PostInput): Post!
    deletePost(id: ID!): Boolean
    updateStatus(status: String!): User!
}

type RootQuery {
    login(email: String!, password: String!): AuthData!
    getPost(page: Int!): PostData!
    getSinglePost(id: ID!): Post!
    user: User!
}

schema {
    query: RootQuery
    mutation: Mutation
}`);
