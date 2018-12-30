import redis from 'redis';
import Message from '../models/Message';
import Chat from '../models/Chat';

const redisPub = redis.createClient();

export const getChatMessages = (req, res, next) => {
  const userId = req.user.id;
  const { chatId } = req.params;

  Message.find({ chatId: chatId }).exec()
    .then(messages => res.status(200).json(messages))
    .catch(err => next(err));
};

export const createChatMessage = async(req, res, next) => {
  const userId = req.user.id;
  const { chatId } = req.params;
  const { text } = req.body;

  const message = await new Message({
    chatId,
    userId,
    text,
  }).save();

  const chat = await Chat.findByIdAndUpdate(chatId, { $set: { lastMessageId: message.id } });

  res.status(200).json(message);

  const redisMessage = {
    type: 'message',
    toUserId: chat.userIds.filter(id => id !== userId)[0],
    messageId: message.id,
    chatId: chatId,
  };

  redisPub.publish('r/new-message', JSON.stringify(redisMessage));
};
