var express = require('express');
var Milestone = require('../models/Milestone');
var router = express.Router();
var env = process.env.NODE_ENV || 'development'
var config = require('../config')[env];
var _ = require('lodash-node');

router.get('/', function(req, res, next) {
  var query = Milestone.find({}).sort({'date': -1});

  query
    .skip(req.query.offset || 0)
    .limit(8)
    .exec(function(err, milestones) {
      if (err) {
        res.json({
          err: err
        });
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

router.get('/:id', function(req, res, next) {
  Milestone.findOne({_id: req.params.id}, function(err, milestoneFromDb) {
    if (err) {
      res.json({
        err: err
      });
    }
    else {
      res.json(mapSchemaMilestoneToModel(milestoneFromDb));
    }
  });
});

router.post('/', function(req, res) {
  var milestone = new Milestone({
    type: req.body.type,
    title: req.body.title,
    date: req.body.date,
    description: req.body.description,
    images: _.map(req.body.images, function(i) {
      return {
        src: i.src,
        title: i.title,
        isDefault: i.isDefault,
        tags: i.tags
      }
    })
  });

  milestone.save(function(err, updatedMilestone) {
    return returnSaveResult(err, updatedMilestone, res);
  });
});

router.put('/:id', function(req, res) {
  Milestone.findOne({_id: req.params.id}, function(err, milestoneFromDb) {

    milestoneFromDb.type = req.body.type;
    milestoneFromDb.title = req.body.title;
    milestoneFromDb.date = req.body.date;
    milestoneFromDb.description = req.body.description;
    milestoneFromDb.images = req.body.images;

    milestoneFromDb.save(function(err, updatedMilestone) {
      return returnSaveResult(err, updatedMilestone, res);
    });
  });
});

router.delete('/:id', function(req, res) {
  Milestone.findOne({_id: req.params.id}).remove().exec(function(err) {
    if (err) {
      res.json({
        err: err
      });
    }
    else {
      res.json({});
    }
  });

});

function returnSaveResult(err, milestone, res) {
  if (err) {
    res.json({
      err: err
    });
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
    images: milestone.images
  }
}

module.exports = router;
