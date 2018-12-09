import jwt from 'jsonwebtoken';
import config from '../../config';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split('Bearer ')[1];

  if (!token) {
    return res.status(403).json({
      message: 'No token provided.',
    });
  }

  jwt.verify(token, config.jwt.secret, { audience: config.jwt.audience }, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token.' });

    req.user = {
      id: decoded._id,
      email: decoded.email,
      password: decoded.password,
      audience: decoded.audience
    };

    next();
  })
};
