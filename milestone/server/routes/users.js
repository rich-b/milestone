var express = require('express');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var router = express.Router();
var env = process.env.NODE_ENV || 'development'
var config = require('../config')[env];
var _ = require('lodash-node');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/authenticate', function(req, res) {
  User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
    if (err) {
      res.json({
        isAuthenticated: false,
        data: "Error during authentication: " + err
      });
    } else {
      if (user) {
        var expiryDate = new Date();
        var t = expiryDate.getTime() / 1000; // seconds since epoch
        var expireInMinutes = 1;

        user.token = jwt.sign({
          iat: t,
          exp: t + (expireInMinutes*60),
          userId: user._id
        }, config.tokenSecret);

        user.save(function(err, user1) {
          res.json({
            isAuthenticated: true,
            //data: user1,
            token: user1.token
          });
        });
      }
    }
  });
});

router.get('/me', ensureAuthorized, function(req, res) {
  User.findOne({_id: req.userId}, function(err, userFromDb) {
    if (err) {
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      res.json({
        type: true,
        data: userFromDb
      });
    }
  });
});

function ensureAuthorized(req, res, next) {
  var authToken = req.headers["authorization"];
  if (!_.isUndefined(authToken)) {
    var tokenPayload = jwt.decode(authToken, config.tokenSecret);

    console.log('now => ' + new Date().getTime()/1000);
    console.log('exp => ' + tokenPayload.exp);
    console.log('userid => ' + tokenPayload.userId);

    if (new Date().getTime()/1000 > tokenPayload.exp || _.isUndefined(tokenPayload.userId)) {
      res.sendStatus(403);
    } else {
      req.userId = tokenPayload.userId;
      next();
    }
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
