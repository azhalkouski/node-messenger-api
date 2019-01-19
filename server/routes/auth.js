import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import config from '../../config';
import User from '../models/User';
import { authErrorMessage } from '../errorMessages';

export const authenticate = async(req, res, next) => {
  try {

    const user = await User.findOne({ email: req.body.email }).lean();

    if (!user) {
      return res.status(404).json({ ...authErrorMessage, email: 'User not found.'});
    }

    const isPasswordMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ ...authErrorMessage, password: 'Wrong password.'});
    }

    const token = jwt.sign(user, config.jwt.secret );

    res.status(200).json({ ...user, token });

  } catch (error) {
    next(error);
  }
}
