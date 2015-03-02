angular.module('milestone.services', [])

.service('milestoneService', function ($q, guid) {

  var milestones = [
    { type:'Firsts', title: 'First Smile', id: '01d238c7-426c-4031-aea5-52ad5f5e6f0e' },
    { type:'Event', title: 'Lots of Coos', id: 'b1b70f5c-4e95-4ce9-85e9-2ac8a41d4d88' },
    { type:'Firsts', title: 'Hike in the woods', id: '5b013ba4-7980-49aa-9579-f0bfe0263d25' },
    { type:'Firsts', title: 'Day at the beach', id: '237d95cb-e111-4cb0-8f8d-92372fd19c9e' },
    { type:'Achievement', title: '1 Month old', id: '456e12b5-7fb7-49cf-bba3-d5aee43083c4' },
    { type:'Event', title: 'Day with Grandparents', id: '38896f92-22dd-4445-bab5-7cf584761bf4' }
  ];

  this.getMilestoneList = function (query, offset) {
    var deferred = $q.defer();

    //todo - call api
    deferred.resolve(milestones);

    return deferred.promise;
  };

  this.getMilestone = function(id) {
    var deferred = $q.defer();

    //todo - call api
    deferred.resolve(_.find(milestones, {id: id}));

    return deferred.promise;
  };

  this.addMilestone = function(newMilestone) {
    var deferred = $q.defer();

    newMilestone.id = guid.new();
    milestones.push(newMilestone);

    deferred.resolve();

    return deferred.promise;
  };

  this.updateMilestone = function(milestone) {
    var deferred = $q.defer();

    var i = _.findIndex(milestones, {id: milestone.id});
    milestones[i] = milestone;

    deferred.resolve();

    return deferred.promise;
  };

  this.deleteMilestone = function(milestone) {
    var i = _.findIndex(milestones, {id: milestone.id});
    milestones.splice(i, 1);
  };

})

.factory('guid', function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return {
    new: function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
  };
});