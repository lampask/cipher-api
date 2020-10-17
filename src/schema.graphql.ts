const { gql } = require('apollo-server-express');



export const typeDefs = gql`
  scalar DateTime

  type User {
    uid: ID!
    name: String!
    displayName: String!
    cipherCount: Int!
    pointsCount: Int!
    cipherData: [CDMapTuple]!
    email: String!
    firstName: String!
    lastName: String!
    profilePicture: Picture
    phone: String!
    ciphersSolved: [Cipher]!
    ciphersMade: [Cipher]!
  }

  type CipherData {
    solved: Boolean!
    tried: Int!
  }

  type CDMapTuple {
    key: String
    value: CipherData
  }

  type Notification {
    createdAt: DateTime!
    id: ID!
    link: String!
    readDate: DateTime!
    type: NOTIFICATION_TYPE
    user: User!
  }

  type Picture {
    url: String!
  }
    
  type Cipher {
    id: ID!
    points: Int!
    title: String!
    text: String!
    authorId: String!
    author: User!
    source: String!
    solvedBy: [User]!
  }

  type Query {
    ciphers: [Cipher]
    user(id: String!): User
  }

  type Mutation {
    signup(
      name: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): AuthPayload!
    login(  
      key: String!
      password: String! 
    ): AuthPayload!
    result(
      id: String!
      answer: String!
    ): Boolean!
    newCipher(
      title: String!
      text: String!
      source: String!
      points: Int!
      answer: String!
    ): Cipher
  }

  type AuthPayload {
    token: String
    user: User
  }

  enum NOTIFICATION_TYPE {
    OFFER
    INSTANT_BOOK
    RESPONSIVENESS
    NEW_AMENITIES
    HOUSE_RULES
  }
`;