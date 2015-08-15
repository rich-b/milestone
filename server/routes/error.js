var express = require('express');
var router = express.Router();
var authenticationService = require('../services/authentication');

router.post('/', authenticationService.ensureAuthorized, function(req, res, next) {
  console.log(req.body);
  res.status(201).send();
});

module.exports = router;
