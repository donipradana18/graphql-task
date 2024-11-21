const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { buildSchema } = require('graphql');

// Membuat koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/graphqlcrud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();

// Membuat Schema GraphQL
const schema = buildSchema(`
  type Query {
    getUsers: [User]
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): User
  }

  type User {
    id: ID
    name: String
    email: String
  }
`);

// Membuat Model untuk MongoDB
const User = mongoose.model('User', {
  name: String,
  email: String,
});

// Resolver untuk Query dan Mutation
const rootValue = {
  getUsers: async () => {
    return await User.find();
  },
  getUser: async ({ id }) => {
    return await User.findById(id);
  },
  createUser: async ({ name, email }) => {
    const user = new User({ name, email });
    return await user.save();
  },
  updateUser: async ({ id, name, email }) => {
    const user = await User.findById(id);
    if (name) user.name = name;
    if (email) user.email = email;
    return await user.save();
  },
  deleteUser: async ({ id }) => {
    const user = await User.findByIdAndDelete(id);
    return user;
  }
};

// Menghubungkan GraphQL dengan Express
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootValue,
  graphiql: true, // Enable GraphiQL interface
}));

// Menjalankan Server
app.listen(4000, () => {
  console.log('Server running on http://localhost:4000/graphql');
});
