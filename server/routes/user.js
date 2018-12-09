import User from '../models/User';

export const createUser = (req, res, next) => {
  const { email, password } = req.body;

  const user = new User({
    email,
    password,
  });

  return user.save()
    .then(user => res.status(200).json(user))
    .catch(err => next(err));
};
