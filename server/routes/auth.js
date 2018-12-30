import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../models/User';

export const authenticate = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .lean()
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Authentication failed. User not found.' });
      }

      if (user.password !== req.body.password) {
        return res.status(400).json({ message: 'Authentication failed. Wrong password.' });
      }

      try {
        const token = jwt.sign(user, config.jwt.secret, { audience: config.jwt.audience });
        res.status(200).json({
          _id: user._id,
          email: user.email,
          token,
        });
      } catch (error) {
        return next(error);
      }
    })
    .catch(err => next(err));
}
