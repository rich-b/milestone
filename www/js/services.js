angular.module('milestone.services', [])

.service('milestoneService', function ($rootScope, $q, $http, $resource) {

  var resourceUri = $rootScope.serviceUriPrefix + '/milestones/:milestoneId';
  var Milestone = $resource(resourceUri, {milestoneId:'@id'}, {
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

.service('userService', function($rootScope, $resource, $http) {

  this.authenticate = function(authRequest) {
    var resourceUri = $rootScope.serviceUriPrefix + '/users/authenticate';
    return $http.post(resourceUri, authRequest);
  };

})

.service('pictureService', function ($rootScope, $q, $http, $resource) {

  var resourceUri = $rootScope.serviceUriPrefix + '/pictures/:pictureId';
  var Pictures = $resource(resourceUri, {milestoneId:'@id'}, {
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

  this.upload = function(encodedImage) {
    setAuthHeader();
    return Pictures.save({encodedImage: encodedImage}).$promise;
  };

  function setAuthHeader() {
    $http.defaults.headers.common['authorization']= window.localStorage['authToken'];
  }
})

.factory('cameraService', function($rootScope, $q) {
  var localMediaStream = undefined;
  var _cameraIsVisible = false;

  return {
    cameraIsVisible: _cameraIsVisible,
    loadCamera: function() {
      var hdConstraints = {
        video: {
          mandatory: {
            minWidth: 1280,
            minHeight: 720
          }
        }
      };

      navigator.webkitGetUserMedia(hdConstraints, function(stream) {
        var video = document.getElementById('pictureVideo');
        video.src = window.URL.createObjectURL(stream);
        localMediaStream = stream;
      }, function(err) {
        console.log(err);
      });
    },
    turnOffCamera: function() {
      if (localMediaStream) localMediaStream.stop();
    },
    takePicture: function() {
      var canvas = document.getElementById('pictureCanvas');
      var video = document.getElementById('pictureVideo');

      //canvas.width = video.clientWidth;
      //canvas.height = video.clientHeight;

      canvas.getContext('2d').drawImage(video, 0, 0);
      var dataUrl = canvas.toDataURL('image/webp');
      var img = dataUrl.substring(dataUrl.indexOf(',')+1);

      if (localMediaStream) localMediaStream.stop();

      return img;
    },
    getPicture: function(options) {
      var d = $q.defer();

      //if (Modernizr.getusermedia) {
        //var gUM = Modernizr.prefixed('getUserMedia', navigator);
        //gUM({video: true}, function(stream) {
        navigator.webkitGetUserMedia({video: true}, function(stream) {

          var video = document.getElementById('pictureVideo');
          //var canvas = document.createElement("canvas");
          var canvas = document.getElementById('pictureCanvas');

          video.src = stream;
          //canvas.getContext('2d').drawImage(video, 0, 0, 300, 300, 0, 0, 300, 300);
          canvas.getContext('2d').drawImage(video, 0, 0);
          var dataUrl = canvas.toDataURL('image/webp');

          var img = dataUrl.substring(dataUrl.indexOf(',')+1);

          stream.stop();

          d.resolve(img);
        }, function(err) {
          console.log(err);
        });
      //}

      /*navigator.camera.getPicture(function(result) {
        d.resolve(result);
      }, function(err) {
        d.reject(err);
      }, options);*/

      return d.promise;
    }
  }
});