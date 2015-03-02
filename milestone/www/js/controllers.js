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

.controller('MilestoneListCtrl', function($scope, $location, milestoneService) {
  milestoneService.getMilestoneList().then(function(list) {
    $scope.milestones = list;
  });

  $scope.create = function() {
    $location.path('/app/create-milestone');
  };

  $scope.edit = function(item) {
    $location.path('/app/edit-milestone/' + item.id);
  };

  $scope.delete = function(item) {
    milestoneService.deleteMilestone(item);
  };
})

.controller('MilestoneEditCtrl', function($scope, $filter, $location, $stateParams, milestoneService) {
  $scope.milestoneModel = {};
  $scope.isNew = true;

  if (_.isUndefined($stateParams.id) || $stateParams.id === '') {
    $scope.milestoneModel = {
      date: new Date($filter("date")(Date.now(), 'yyyy-MM-dd'))
    };
  } else {
    milestoneService.getMilestone($stateParams.id).then(function(milestone) {
      $scope.milestoneModel = angular.copy(milestone);
      $scope.isNew = false;
    });
  }

  $scope.save = function() {
    if ($scope.isNew) {
      milestoneService.addMilestone($scope.milestoneModel).then(function success() {
        $location.path('/app/milestone-list');
      }, function error(err) {
        console.log(err);
      });
    } else {
      milestoneService.updateMilestone($scope.milestoneModel).then(function success() {
        $location.path('/app/milestone-list');
      }, function error(err) {
        console.log(err);
      });
    }

  };

});
