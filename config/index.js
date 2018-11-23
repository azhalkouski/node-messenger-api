export default {
  port: 8080,
  secret: 'messenger-app-secret',
  mongoose: {
    uri: 'mongodb://localhost/messenger',
    options: {
      keepAlive: 1,
      useCreateIndex: true,
      useNewUrlParser: true
    }
  }
}
