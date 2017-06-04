import express from 'express';
import passport from 'passport';
import User from '../models/user';
import { sign } from '../services/jwt'

var router = express.Router();

router.post('/register', function(req, res) {
  User.register(new User({ nome: req.body.nome, 
                           admin: req.body.admin, 
                           username: req.body.username }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      sign(user.id).then((token) => {
        res.status(200).json({
          nome: user.nome,
          admin: user.admin,
          username: user.username,
          token
        });
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }

  sign(req.user.id).then((token) => {
    res.status(200).json({
      status: true,
      token
    });
  });
});

module.exports = router;