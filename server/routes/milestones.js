var express = require('express');
var Milestone = require('../models/Milestone');
var router = express.Router();
var env = process.env.NODE_ENV || 'development'
var config = require('../config')[env];
var _ = require('lodash-node');
var authenticationService = require('../services/authentication');

router.get('/', authenticationService.ensureAuthorized, function(req, res, next) {
  var query = Milestone.find({}).sort({'date': -1});

  query
    .skip(req.query.offset || 0)
    .limit(15)
    .exec(function(err, milestones) {
      if (err) {
        res.status(500).send({message: err});
      }
      else {
        delete query.options.sort;
        delete query.options.limit;
        query.count(function(err, count) {
          res.json({
            total: count,
            results: mapSchemaMilestonsToModels(milestones)
          });
        });

      }
    });

});

router.get('/:id', authenticationService.ensureAuthorized, function(req, res, next) {
  Milestone.findOne({_id: req.params.id}, function(err, milestoneFromDb) {
    if (err) {
      res.status(500).send({message: err});
    }
    else if (!milestoneFromDb) {
      res.status(404);
      res.json({message: 'Milestone not found.'});
    }
    else {
      res.json(mapSchemaMilestoneToModel(milestoneFromDb));
    }
  });
});

router.post('/', authenticationService.ensureAuthorized, function(req, res) {
  var milestone = new Milestone({
    type: req.body.type,
    title: req.body.title,
    date: req.body.date,
    description: req.body.description,
    activities: req.body.activities,
    favorites: req.body.favorites,
    images: _.map(req.body.images, function(i) {
      return {
        src: i.src,
        title: i.title,
        isDefault: i.isDefault,
        tags: i.tags
      }
    }),
    createdBy: req.userId,
    createdDate: new Date()
  });

  milestone.save(function(err, updatedMilestone) {
    return returnSaveResult(err, updatedMilestone, res);
  });
});

router.put('/:id', authenticationService.ensureAuthorized, function(req, res) {
  Milestone.findOne({_id: req.params.id}, function(err, milestoneFromDb) {

    milestoneFromDb.type = req.body.type;
    milestoneFromDb.title = req.body.title;
    milestoneFromDb.date = req.body.date;
    milestoneFromDb.description = req.body.description;
    milestoneFromDb.activities = req.body.activities;
    milestoneFromDb.favorites = req.body.favorites;
    milestoneFromDb.images = req.body.images;
    milestoneFromDb.lastModifiedBy = req.userId;
    milestoneFromDb.lastModifiedDate = new Date();

    milestoneFromDb.save(function(err, updatedMilestone) {
      return returnSaveResult(err, updatedMilestone, res);
    });
  });
});

router.delete('/:id', authenticationService.ensureAuthorized, function(req, res) {
  Milestone.findOne({_id: req.params.id}).remove().exec(function(err) {
    if (err) {
      res.status(500).send({message: err});
    }
    else {
      res.json({});
    }
  });
});

function returnSaveResult(err, milestone, res) {
  if (err) {
    res.status(500).send({message: err});
  }
  else {
    res.json(mapSchemaMilestoneToModel(milestone));
  }
}

function mapSchemaMilestonsToModels(milestones) {
  return _.map(milestones, mapSchemaMilestoneToModel);
}

function mapSchemaMilestoneToModel(milestone) {
  return {
    id: milestone._id,
    type: milestone.type,
    title: milestone.title,
    date: milestone.date,
    description: milestone.description,
    favorites: milestone.favorites,
    activities: milestone.activities,
    images: milestone.images
  }
}

module.exports = router;
