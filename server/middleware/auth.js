import jwt from 'jsonwebtoken';
import config from '../../config';

export const ensureAuthenticated = (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(403).json({
      message: 'No token provided.',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token.' })

    req.user = user;
    next();
  })
};
