angular.module('milestone.services', [])

.service('milestoneService', function ($q, $http, $resource) {

  var Milestone = $resource('http://localhost:3000/milestones/:milestoneId', {milestoneId:'@id'}, {
    query: {
      isArray: false
    },
    get: {
      transformResponse: function(data) {
        var m = angular.fromJson(data);
        m.date = new Date(m.date);
        return m;
      }
    },
    update: {
      method: 'PUT'
    }
  });

  this.getMilestoneList = function (query, offset) {
    //return $http.get('http://localhost:3000/milestones?query=' + query + '&offset=' + offset);
    return Milestone.query({query: query, offset: offset}).$promise;
  };

  this.getMilestone = function(id) {
    return Milestone.get({milestoneId: id});
  };

  this.addMilestone = function(newMilestone) {
    return Milestone.save(newMilestone).$promise;
  };

  this.updateMilestone = function(milestone) {
    return Milestone.update(milestone).$promise;
  };

  this.deleteMilestone = function(milestone) {
    return Milestone.delete({}, {'id': milestone.id}).$promise;
  };

})

/*.factory('guid', function() {
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
})*/

.factory('cameraService', function($q) {
  return {
    getPicture: function(options) {
      var d = $q.defer();

      navigator.camera.getPicture(function(result) {
        d.resolve(result);
      }, function(err) {
        d.reject(err);
      }, options);

      return d.promise;
    }
  }
});