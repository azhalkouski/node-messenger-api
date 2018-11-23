import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../models/User';
import { ensureAuthenticated } from '../middleware/auth';
const router = new Router();

router.post('/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username,
  })
    .lean()
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Authentication failed. User not found.' });
      }

      if (user.password !== req.body.password) {
        return res.status(400).json({ message: 'Authentication failse. Wrong password.' });
      }

      try {
        const token = jwt.sign(user, config.secret);
        res.status(200).json({
          token,
        });
      } catch (error) {
        return next(error);
      }
    })
    .catch(err => console.log(err));
});

router.get('/users', ensureAuthenticated, function(req, res, next) {

  User.find({}, function(err, users) {

    if (err) return next(err);

    res.json(users);
  });

});

router.get('/testUsers', function(req, res, next) {
  const user = new User({
    username: 'testUser',
    password: 'password'
  });

  user.save(err => {
    // * OK: been caught by main error handler
    if (err) return next(err);

    console.log('User saved successfully');
    res.status(201).send('Created');
  });
});

module.exports = router;
