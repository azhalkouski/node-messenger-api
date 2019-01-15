import redis from 'redis';
import config from '../../config';
import Message from '../models/Message';
import Chat from '../models/Chat';

const redisPub = redis.createClient({ host: config.redis.host });

export const getChatMessages = (req, res, next) => {
  const { chatId } = req.params;

  Message.find({ chatId: chatId }).exec()
    .then(messages => res.status(200).json(messages))
    .catch(err => next(err));
};

export const createChatMessage = async(req, res, next) => {
  const userId = req.user._id;
  const { chatId } = req.params;
  const { text } = req.body;

  const message = await new Message({
    chatId,
    userId,
    text,
  }).save();

  const chat = await Chat.findByIdAndUpdate(chatId, { $set: { lastMessageId: message._id } });

  res.status(200).json(message);

  const redisMessage = {
    type: 'message',
    toUserId: chat.userIds.filter(id => id !== userId)[0],
    messageId: message._id,
    chatId: chatId,
  };

  redisPub.publish('r/new-message', JSON.stringify(redisMessage));
};
