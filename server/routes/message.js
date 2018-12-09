import Message from '../models/Message';
import Chat from '../models/Message';

export const getChatMessages = (req, res, next) => {
  const userId = req.user.id;
  const { chatId } = req.params;

  Message.find({ chatId: chatId }).exec()
    .then(messages => res.status(200).json(messages))
    .catch(err => next(err));
};

export const createChatMessage = (req, res, next) => {
  const userId = req.user.sub;
  const { chatId } = req.params;
  const { text } = req.body;

  const message = new Message({
    chatId,
    userId,
    text,
  });

  message.save()
    .then(message => {
      return Chat.findByIdAndUpdate(chatId, {
        lastMessageId: message.id,
        lastMessageCreated: message.created,
      })
      .then(() => message)
      .catch(err => next(err));
    })
    .then(message => res.status(200).json(message))
    .catch(err => next(err));
};
