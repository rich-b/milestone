angular.module('milestone.directives', [])

.directive('milestoneCamera', function() {
  return {
    scope:{
      displayCamera:'='
    },
    controller: 'MilestoneCameraCtrl',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'templates/camera.html'
  };
})

.controller('MilestoneCameraCtrl', function(
  $rootScope,
  $scope,
  cameraService
) {
  this.takePicture = function() {
    var encodedImage = cameraService.takePicture();
    $rootScope.$broadcast('PICTURE_TAKEN', encodedImage);
    this.displayCamera = false;
  };

  this.cancel = function() {
    this.displayCamera = false;
    cameraService.turnOffCamera();
  };

  $scope.$watch(angular.bind(this, function () {
    return this.displayCamera;
  }), function (newVal, oldVal) {
    if (newVal && !oldVal) {
      cameraService.loadCamera();
    }
  });
});