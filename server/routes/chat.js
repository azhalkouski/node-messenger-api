import uniq from 'lodash/uniq';
import redis from 'redis';
import Chat from '../models/Chat';
import Message from '../models/Message';
import User from '../models/User';
import config from '../../config';
import { createChatByEmailErrorMessage, createChatErrorMessage } from '../errorMessages';
import { NO_SUCH_USER, CHAT_ALREADY_EXISTS } from '../constants';

const redisPub = redis.createClient({ host: config.redis.host });

const getAllUserIds = chats => chats.reduce((acc, chat) => acc.concat(chat.userIds), []);
const getAllUniqUserIds = chats => uniq(getAllUserIds(chats));

const getAllMessageIds = chats => chats.reduce((acc, chat) => acc.concat([chat.lastMessageId]), []);

export const getChats = async(req, res, next) => {
  try {

    const userId = req.user._id;
    const chats = await Chat.find({ userIds: userId }).exec();
    const userIds = getAllUniqUserIds(chats);
    const messageIds = getAllMessageIds(chats);
    const [ users, messages ] = await Promise.all([
      User.find({ _id: { $in: userIds } }).exec(),
      Message.find({ _id: { $in: messageIds } }).exec(),
    ]);

    res.status(200).json({ chats, users, messages });

  } catch (error) {
    next(error);
  }
};

export const createChat = async (req, res, next) => {
  const userId = req.user._id;
  const { peerId } = req.body;

  try {

    const peer = await User.findOne({ _id: peerId });
    if (peer === null) {
      return res.status(400).json({
        ...createChatErrorMessage,
        message: NO_SUCH_USER,
      });
    }

    const existingChat = await Chat.findOne({
      userIds: { $size: 2, $all: [userId, peerId] }
    });
  
    if (existingChat !== null) {
      return res.status(400).json({
        ...createChatErrorMessage,
        message: CHAT_ALREADY_EXISTS,
      });
    }

    const chat = await new Chat({ userIds: [userId, peerId] }).save();
    res.status(200).json(chat);

    const redisMessage = {
      type: 'chat',
      toUserId: peerId,
      chatId: chat._id,
    };

    redisPub.publish('r/new-message', JSON.stringify(redisMessage));

  } catch (error) {
    next(error);
  }

};

// this function is likely to be deleted
export const createChatByEmail = async(req, res, next) => {
  const userId = req.user._id;
  const peer = await User.findOne({ email: req.body.email });

  if (peer === null) {
    return res.status(400).json({
      ...createChatByEmailErrorMessage,
      message: NO_SUCH_USER,
    });
  }

  const peerId = peer._id;
  const existingChat = await Chat.findOne({
    userIds: { $size: 2, $all: [userId, peerId] }
  });

  if (existingChat !== null) {
    return res.status(400).json({
      ...createChatByEmailErrorMessage,
      message: CHAT_ALREADY_EXISTS,
    });
  }

  console.log(`Create chat by email ${req.body.email}`);

  try {
    const chat = await new Chat({ userIds: [userId, peerId] }).save();
  
    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};
