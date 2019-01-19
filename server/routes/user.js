import bcryptjs from 'bcryptjs';
import User from '../models/User';
import { isEmailValid, isPasswordValid } from '../utils/validate';
import { authErrorMessage } from '../errorMessages';

export const createUser = async(req, res, next) => {
  try {

    const { email, password } = req.body;
  
    if (!isEmailValid(email)) {
      return res.status(400).json({ ...authErrorMessage, email: 'Email invalid.'});
    }
  
    if (!isPasswordValid(password)) {
      return res.status(400).json({ ...authErrorMessage, password: 'Password invalid.'});
    }
  
    const hash = await bcryptjs.hash(password, 10);
    const user = await new User({ email, password: hash }).save();
  
    res.status(200).json(user);

  } catch (error) {
    next(error);
  }
};
