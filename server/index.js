import express from 'express';
import http from 'http';
import socket from 'socket.io';
import morgan from 'morgan';
import mongoose from 'mongoose';
import redis from 'redis';
import config from '../config';
import routes from './routes';

const app = express();
mongoose.connect(config.mongoose.host, config.mongoose.options);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong');
});

/**
 * Create HTTP server, Socket server, Redis client.
 */
const server = http.Server(app);
const io = socket(server);
const redisSub = redis.createClient({ host: config.redis.host });

const getNewMessage = (clientUserId) => {
  return new Promise((resolve) => {
    redisSub.on('message', (channel, message) => {
      const newMessage = JSON.parse(message);
      console.log(`${clientUserId}: message for ${newMessage.toUserId}`);
      if (channel === 'r/new-message' && clientUserId === newMessage.toUserId) {
        resolve(newMessage);
      }
    });
  });
}

io.on('connection', (socket) => {
  socket.on('ws/listening', async({ userId }) => {
    console.log(`Client ${userId} listening for incomming messages`);
    while (true) {
      const newMessage = await getNewMessage(userId);
      console.log(`New message for client ${userId}: ${newMessage.messageId}`);
      socket.emit('ws/new-message', newMessage);
    }
  })
});

redisSub.on('error', (err) => {
  console.log('Error redis:', err);
});

redisSub.subscribe('r/new-message');

module.exports = server;
