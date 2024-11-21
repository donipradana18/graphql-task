const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 1. Definisikan skema GraphQL
const typeDefs = gql`
  type User {
    id: Int
    name: String
    email: String
  }

  type Query {
    users: [User]
    user(id: Int!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: Int!, name: String, email: String): User
    deleteUser(id: Int!): User
  }
`;

// 2. Buat resolver
const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    user: async (_, { id }) => {
      return await prisma.user.findUnique({
        where: { id: id }
      });
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      return await prisma.user.create({
        data: {
          name: name,
          email: email
        }
      });
    },
    updateUser: async (_, { id, name, email }) => {
      return await prisma.user.update({
        where: { id: id },
        data: {
          name: name,
          email: email
        }
      });
    },
    deleteUser: async (_, { id }) => {
      return await prisma.user.delete({
        where: { id: id }
      });
    }
  }
};

// 3. Inisialisasi server Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 4. Jalankan server
server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
