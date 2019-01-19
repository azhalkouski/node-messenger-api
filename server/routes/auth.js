import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../models/User';
import { authErrorMessage } from '../errorMessages';

export const authenticate = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .lean()
    .then(user => {
      if (!user) {
        return res.status(404).json({ ...authErrorMessage, email: 'User not found.'});
      }

      if (user.password !== req.body.password) {
        return res.status(400).json({ ...authErrorMessage, password: 'Wrong password.'});
      }

      try {
        const token = jwt.sign(user, config.jwt.secret, { audience: config.jwt.audience });
        const { password, ...restUser } = user;
        res.status(200).json({
          ...restUser,
          token,
        });
      } catch (error) {
        return next(error);
      }
    })
    .catch(err => next(err));
}
