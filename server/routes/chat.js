import uniq from 'lodash/uniq';
import Chat from '../models/Chat';
import Message from '../models/Message';
import User from '../models/User';

const getAllUserIds = chats => chats.reduce((acc, chat) => acc.concat(chat.userIds), []);
const getAllUniqUserIds = chats => uniq(getAllUserIds(chats));

const getAllMessageIds = chats => chats.reduce((acc, chat) => acc.concat([chat.lastMessageId]), []);

export const getChats = async(req, res, next) => {
  const userId = req.user.id;
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
  const peer = await User.findOne({ email: req.body.email });
  //! TODO: handle error when peer's not found
  const peerId = peer._id;

  console.log(`Create chat by email ${req.body.email}`);

  const chat = new Chat({
    userIds: [userId, peerId],
  });

  chat.save()
    .then(chat => res.status(200).json(chat));
}
