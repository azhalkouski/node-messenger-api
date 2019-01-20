import uniq from 'lodash/uniq';
import Chat from '../models/Chat';
import Message from '../models/Message';
import User from '../models/User';
import { createChatByEmailErrorMessage } from '../errorMessages';
import { NO_USERS_WITH_SUCH_EMAIL, CHAT_ALREADY_EXISTS } from '../constants';

const getAllUserIds = chats => chats.reduce((acc, chat) => acc.concat(chat.userIds), []);
const getAllUniqUserIds = chats => uniq(getAllUserIds(chats));

const getAllMessageIds = chats => chats.reduce((acc, chat) => acc.concat([chat.lastMessageId]), []);

export const getChats = async(req, res, next) => {
  const userId = req.user._id;
  const chats = await Chat.find({ userIds: userId }).exec();
  const userIds = getAllUniqUserIds(chats);
  const messageIds = getAllMessageIds(chats);
  const [ users, messages ] = await Promise.all([
    User.find({ _id: { $in: userIds } }).exec(),
    Message.find({ _id: { $in: messageIds } }).exec(),
  ]);

  res.status(200).json({ chats, users, messages });
};

export const createChat = (req, res, next) => {
  const userId = req.user.id;
  const { peerId } = req.body;

  const chat = new Chat({
    userIds: [userId, peerId],
  });

  chat.save()
    .then(chat => res.status(200).json(chat))
    .catch(err => next(err));
};

export const createChatByEmail = async(req, res, next) => {
  const userId = req.user._id;
  console.log('userId', userId);
  const peer = await User.findOne({ email: req.body.email });
  console.log('peer', peer);

  if (peer === null) {
    return res.status(400).json({
      ...createChatByEmailErrorMessage,
      message: {
        ...createChatByEmailErrorMessage.message,
        email: NO_USERS_WITH_SUCH_EMAIL,
      }
    });
  }

  const peerId = peer._id;
  const existingChat = await Chat.findOne({
    userIds: { $size: 2, $all: [userId, peerId] }
  });

  if (existingChat !== null) {
    return res.status(400).json({
      ...createChatByEmailErrorMessage,
      message: {
        ...createChatByEmailErrorMessage.message,
        email: CHAT_ALREADY_EXISTS,
      }
    });
  }

  console.log(`Create chat by email ${req.body.email}`);

  try {
    const chat = await new Chat({ userIds: [userId, peerId] }).save();
  
    res.status(200).json(chat)
  } catch (error) {
    next(error);
  }
}
