var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'development'
var config = require('../config')[env];
var _ = require('lodash-node');
var authenticationService = require('../services/authentication');
var googleService = require('../services/googleService');
var url = require('url');

router.post('/', authenticationService.ensureAuthorized, function(req, res, next) {
  console.log('uploading picture to google...');
  googleService.uploadPicture(req.userId, req.body.encodedImage, function(url) {
      console.log('success uploading to google :)');
    res.json({
      imageUrl: url
    });
  },
  function error(err) {
    console.log(err);
    res.status(500).send({err: err});
  });
});

router.get('/verify', function(req, res, next) {
  console.log("trying to get auth tokens");

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  googleService.getTokenFromCode();

  res.status(200);
  res.write('Authorization was received.  You can safely close this browser window.');
});

module.exports = router;
