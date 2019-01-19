import User from '../models/User';
import { isEmailValid, isPasswordValid } from '../utils/validate';
import { authErrorMessage } from '../errorMessages';

export const createUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!isEmailValid(email)) {
    return res.status(400).json({ ...authErrorMessage, email: 'Email invalid.'});
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({ ...authErrorMessage, password: 'Password invalid.'});
  }

  const user = new User({
    email,
    password,
  });

  return user.save()
    .then(user => res.status(200).json(user))
    .catch(err => next(err));
};
