var express = require('express');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var router = express.Router();
var env = process.env.NODE_ENV || 'development'
var config = require('../config')[env];
var tokenSecret = process.env.TOKEN_SECRET || config.tokenSecret;
var _ = require('lodash-node');
var authenticationService = require('../services/authentication');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/authenticate', function(req, res) {
  User.findOne({email: req.body.username.toLowerCase(), password: req.body.password}, function(err, user) {
    if (err) {
      res.status(500).send({message: 'Error during authentication: ' + err});
    } else {
      if (user) {
        var expiryDate = new Date();
        var t = expiryDate.getTime() / 1000; // seconds since epoch
        var expireInMinutes = 7200; // 5 days

        user.token = jwt.sign({
          iat: t,
          exp: t + (expireInMinutes*60),
          userId: user._id
        }, tokenSecret);

        user.save(function(err, user1) {
          res.json({
            isAuthenticated: true,
            token: user1.token
          });
        });
      }
      else {
        res.sendStatus(401);
      }
    }
  });
});

router.get('/me', authenticationService.ensureAuthorized, function(req, res) {
  User.findOne({_id: req.userId}, function(err, userFromDb) {
    if (err) {
      res.status(500).send({message: 'Error during authentication: ' + err});
    } else {
      res.json({
        type: true,
        data: userFromDb
      });
    }
  });
});

module.exports = router;
