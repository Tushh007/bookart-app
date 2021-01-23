const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/users');
const { findOne } = require('../models/users');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to register user' });
    } else {
      res.json({ success: true, msg: 'User Registered' });
    }
  });
});

// Authenticate
router.post('/auth', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800, // 1 week
        });

        res.json({
          success: true,
          msg: 'User logged in',
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            cart: user.cart,
          },
        });
      } else {
        return res.json({ success: false, msg: 'Wrong password' });
      }
    });
  });
});

// Profile
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.send({ user: req.user });
  }
);

// Cart - passport.authenticate('jwt', { session: false }),
router.patch('/cart', async (req, res, next) => {
  const cartDetails = req.body;
  const currentCart = cartDetails.currentCart

  if (!cartDetails.username) {
    return res.json({ success: false, msg: 'Invalid request' });
  }
  const result = await User.findOneAndUpdate(
    { username: cartDetails.username },
    { cart: currentCart },
    { new: true, useFindAndModify: false }
  );
  if (result) res.send({ success: true, msg: 'Cart updated successfully.' });
  else res.send({ success: false, msg: 'Something went wrong.' });
});

module.exports = router;
