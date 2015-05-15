var _ = require('lodash-node');
var jwt = require('jsonwebtoken');
var env = process.env.NODE_ENV || 'development'
var config = require('../config')[env];
var tokenSecret = process.env.TOKEN_SECRET || config.tokenSecret;

module.exports = {
  ensureAuthorized: function (req, res, next) {
    var authToken = req.headers["authorization"];
    if (!_.isUndefined(authToken)) {
      var tokenPayload = jwt.decode(authToken, tokenSecret);

      //console.log('now => ' + new Date().getTime()/1000);
      //console.log('exp => ' + tokenPayload.exp);
      //console.log('userid => ' + tokenPayload.userId);

      if (new Date().getTime()/1000 > tokenPayload.exp || _.isUndefined(tokenPayload.userId)) {
        res.status(403);
        res.json({error:'Forbidden'});
      } else {
        req.userId = tokenPayload.userId;
        next();
      }
    } else {
      res.status(403);
      res.json({error:'Forbidden'});
    }
  }
};

