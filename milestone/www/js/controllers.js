angular.module('milestone.controllers', ['milestone.filters'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('MilestoneListCtrl', function($scope, $location, $state, milestoneService) {
  var self = this;

  // workaround to watch when the list resolve is refreshed
  $scope.$state = $state;
  $scope.$watch('$state.$current.locals.globals.milestoneListResponse', function(milestoneListResponse) {
    self.totalResultCount = milestoneListResponse.total;
    self.milestones = milestoneListResponse.results;
  });

  this.create = function() {
    $location.path('/app/create-milestone');
  };

  this.edit = function(item) {
    $location.path('/app/edit-milestone/' + item.id);
  };

  this.delete = function(item) {
    milestoneService.deleteMilestone(item).then(function success() {
      $state.reload();
    }, function error(err) {

    });
  };

  this.moreMilestonesExist = function() {
    return self.milestones && self.milestones.length < self.totalResultCount;
  };

  this.loadMoreMilestones = function() {
    milestoneService.getMilestoneList('', self.milestones.length).then(function(response) {
      Array.prototype.push.apply(self.milestones, response.results);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');
    });
  };
})

.controller('MilestoneViewCtrl', function($location, $stateParams, milestoneService) {
  this.milestoneModel = {};
  var self = this;

  self.milestoneModel = milestoneService.getMilestone($stateParams.id);
  if (self.milestoneModel.images && self.milestoneModel.images.length > 0) {
    self.milestoneModel.mainImage = _.find(self.milestoneModel.images, {isDefault: true}) || self.milestoneModel.images[0];
  }

  self.edit = function(item) {
    $location.path('/app/edit-milestone/' + self.milestoneModel.id);
  };
})

.controller('MilestoneEditCtrl', function($filter, $location, $stateParams, milestoneService, cameraService) {
  this.milestoneModel = {};
  this.isNew = true;
  this.displayTab = 'details';
  var self = this;

  if (_.isUndefined($stateParams.id) || $stateParams.id === '') {
    this.milestoneModel = {
      date: new Date($filter("date")(Date.now(), 'yyyy-MM-dd'))
    };
  } else {
    self.milestoneModel = milestoneService.getMilestone($stateParams.id);
    self.isNew = false;
  }

  this.save = function() {
    if (this.isNew) {
      milestoneService.addMilestone(self.milestoneModel).then(function success() {
        $location.path('/app/milestone-list');
      }, function error(err) {
        console.log(err);
      });
    } else {
      milestoneService.updateMilestone(self.milestoneModel).then(function success() {
        $location.path('/app/milestone-list');
      }, function error(err) {
        console.log(err);
      });
    }
  };

  this.takePicture = function() {
    cameraService.getPicture().then(function(imageURI) {
      self.imgUri = imageURI;
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
  };

});
