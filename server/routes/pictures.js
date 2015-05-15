var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development'
var config = require('../config')[env];
var _ = require('lodash-node');
var authenticationService = require('../services/authentication');
var flikrService = require('../services/flikrService');

router.get('/', authenticationService.ensureAuthorized, function(req, res, next) {
  flikrService.getPictures();
});

router.get('/flickr-verify', function(req, res, next) {
  res.write('Authorisation was received.  You can safely close this browser window.');
  flikrService.setUserAccessTokens(req.query);
});

module.exports = router;
