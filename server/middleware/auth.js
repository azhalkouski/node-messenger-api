import jwt from 'jsonwebtoken';
import config from '../../config';

export const verifyToken = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(403).json({
      message: 'No token provided.',
    });
  }

  jwt.verify(token, config.jwt.secret, { aud: config.jwt.audience }, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token.' })

    req.user = {
      id: decoded._id,
      username: decoded.username,
      password: decoded.password,
      aud: decoded.aud
    };

    next();
  })
};
