export default {
  port: 8080,
  jwt: {
    secret: new Buffer.from('Tdygao7Z2UvjbybRd9N0jrdIxQhMHLhfh2IOPfyQ_17j1mF-3r2vi_u8wnIp0Xnjw5', 'base64'),
    audience: 'uAsgjhJKDHSFFHSDKJFfdsjH5PG3Oq',
  },
  mongoose: {
    uri: 'mongodb://localhost/messenger',
    options: {
      keepAlive: 1,
      useCreateIndex: true,
      useNewUrlParser: true
    }
  }
}