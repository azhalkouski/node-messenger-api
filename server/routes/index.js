import { Router } from 'express';
import config from '../../config';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/auth';
import User from '../models/User';
import Chat from '../models/Chat';

const router = new Router();

router.post('/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username,
  })
    .lean()
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Authentication failed. User not found.' });
      }

      if (user.password !== req.body.password) {
        return res.status(400).json({ message: 'Authentication failse. Wrong password.' });
      }

      try {
        const token = jwt.sign(user, config.jwt.secret, { aud: config.jwt.audience });
        res.status(200).json({
          token,
        });
      } catch (error) {
        return next(error);
      }
    })
    .catch(err => console.log(err));
});

router.get('/users', verifyToken, function(req, res, next) {

  User.find({}, function(err, users) {

    if (err) return next(err);

    res.json(users);
  });

});

router.get('/testUsers', function(req, res, next) {
  const user = new User({
    username: 'testUser',
    password: 'password'
  });

  user.save(err => {
    
    if (err) return next(err);

    console.log('User saved successfully');
    res.status(201).send('Created');
  });
});

router.get('/chats', verifyToken, (req, res) => {
  const userId = req.user._id;

  Chat.find({ userIds: userId })
    .exec()
    .then(chats => res.status(200).json(chats));
});

router.post('/chats', verifyToken, (req, res) => {
  const userId = req.user._id;
  const { peerId } = req.body;

  const chat = new Chat({
    userIds: [userId, peerId],
  });

  chat.save()
    .then(chat => res.status(200).json(chat));
});

export default router;
