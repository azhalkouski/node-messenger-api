import Chat from '../models/Chat';

export const getChats = (req, res, next) => {
  const userId = req.user.id;

  Chat.find({ userIds: userId })
    .exec()
    .then(chats => res.status(200).json(chats))
    .catch(err => next(err));
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
