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
    setAuthHeader();
    return Milestone.query({query: query, offset: offset}).$promise;
  };

  this.getMilestone = function(id) {
    setAuthHeader();
    return Milestone.get({milestoneId: id}).$promise;
  };

  this.addMilestone = function(newMilestone) {
    setAuthHeader();
    return Milestone.save(newMilestone).$promise;
  };

  this.updateMilestone = function(milestone) {
    setAuthHeader();
    return Milestone.update(milestone).$promise;
  };

  this.deleteMilestone = function(milestone) {
    setAuthHeader();
    return Milestone.delete({}, {'id': milestone.id}).$promise;
  };

  // set auth header before every action incase user token changed
  function setAuthHeader() {
    $http.defaults.headers.common['authorization']= window.localStorage['authToken'];
  }

})

.service('userService', function($resource, $http) {

  this.authenticate = function(authRequest) {
    return $http.post('http://localhost:3000/users/authenticate', authRequest);
  };

})

.service('pictureService', function ($q, $http, $resource) {

  var Pictures = $resource('http://localhost:3000/pictures/:pictureId', {milestoneId:'@id'}, {
    /*query: {
      isArray: false
    },*/
    update: {
      method: 'PUT'
    }
  });

  this.get = function (query, offset) {
    setAuthHeader();
    return Pictures.query({query: query, offset: offset}).$promise;
  };

  function setAuthHeader() {
    $http.defaults.headers.common['authorization']= window.localStorage['authToken'];
  }
})

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