import bcryptjs from 'bcryptjs';
import User from '../models/User';
import { isEmailValid, isPasswordValid } from '../utils/validate';
import { authErrorMessage } from '../errorMessages';

export const createUser = async(req, res, next) => {
  const { email, password } = req.body;

  if (!isEmailValid(email)) {
    return res.status(400).json({ ...authErrorMessage, email: 'Email invalid.'});
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({ ...authErrorMessage, password: 'Password invalid.'});
  }

  const hash = await bcryptjs.hash(password, 10);
  
  try {

    const user = await new User({ email, password: hash }).save();
    res.status(200).json(user);

  } catch (error) {

    if (err.code === 11000) {
      res.status(400).json({ ...authErrorMessage, email: 'Email is already in use.'});
    }

    next(error);

  }
};
