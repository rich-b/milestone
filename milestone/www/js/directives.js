angular.module('milestone.directives', [])

.factory('Camera', ['$q', function($q) {
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
}]);