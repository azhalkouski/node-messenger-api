export default {
  port: 8080,
  jwt: {
    secret: 'messenger-secret-Tdygao7Z2UvjbybR',
  },
  redis: {
    host: process.env.NODE_ENV === 'production' ? 'redis' : 'localhost',
  },
  mongoose: {
    host: process.env.NODE_ENV === 'production' ? 'mongo/messenger' : 'mongodb://localhost/messenger',
    options: {
      keepAlive: 1,
      useCreateIndex: true,
      useNewUrlParser: true
    }
  }
};
