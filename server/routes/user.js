import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../models/User';
import { isEmailValid, isPasswordValid } from '../utils/validate';
import { createUserErrorMessage } from '../errorMessages';
import { EMAIL_IN_USE, EMAIL_NOT_VALID, PASSWORD_NOT_VALID } from '../constants';

export const createUser = async(req, res, next) => {
  const { email, password } = req.body;

  if (!isEmailValid(email)) {
    return res.status(400).json({
      ...createUserErrorMessage,
      message: {
        ...createUserErrorMessage.message,
        email: EMAIL_NOT_VALID
      },
    });
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({
      ...createUserErrorMessage,
      message: {
        ...createUserErrorMessage.message,
        password: PASSWORD_NOT_VALID,
      },
    });
  }

  const hash = await bcryptjs.hash(password, 10);
  
  try {

    const user = await new User({ email, password: hash }).save();
    const token = jwt.sign(user.toObject(), config.jwt.secret );
    res.status(200).json({ ...user.toObject(), token });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        ...createUserErrorMessage,
        message: {
          ...createUserErrorMessage.message,
          email: EMAIL_IN_USE
        },
      });
    }

    next(error);

  }
};

export const getUsers = async(req, res, next) => {
  try {

    const users = await User.find().exec();
    res.status(200).json(users);

  } catch (error) {

    next(error);

  }
};
