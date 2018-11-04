const { ApolloServer, gql, ApolloError } = require('apollo-server')

const books = [
  {
    id: "1",
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    id: "2",
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    id: ID
    title: String
    author: String
  }

  input BookInput {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    book(id: ID!): Book
    books: [Book]
  }

  type Mutation {
    createBook(input: BookInput): Book
    updateBook(id: ID!, input: BookInput): Book
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    book: (parent, { id }, ctx, info) => books.find(({ id: bookId }) => bookId === id),
  },
  Mutation: {
    createBook: (parent, bookData, ctx, info) => {
      const book = {
        id: `${books.length + 1}`,
        ...bookData.input
      }
      
      books.push(book)

      return book
    },
    updateBook: (parent, bookData, ctx, info) => {

      const bookIndex = books.findIndex(({ id }) => id === bookData.id)

      if(bookIndex === -1) {
        throw new ApolloError('Book not Found', 404, bookData)
      }

      books[bookIndex] = {
        id: bookData.id,
        ...books[bookIndex],
        ...bookData.input,
      }

      return books[bookIndex]
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    return {
      message: error.message,
      status: error.extensions.code,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});