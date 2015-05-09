// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('milestone', ['ionic', 'ngResource', 'ngCordova', 'milestone.controllers', 'milestone.services', 'milestone.filters', 'angular-carousel'])

.run(function($ionicPlatform, $rootScope, $ionicModal, $state, userService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.loginData = {};

  $rootScope.closeLogin = function() {
    $rootScope.modal.hide();
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $rootScope
  }).then(function(modal) {
    $rootScope.modal = modal;
  });

  $rootScope.doLogin = function() {
    userService.authenticate($rootScope.loginData).then(function success(response) {
      window.localStorage['authToken'] = response.data.token;
      $rootScope.closeLogin();
      $state.reload();
    }, function error(err) {
      console.log(err);
    });
  };

  $rootScope.$on('displayLoginDialog', function() {
    $rootScope.modal.show();
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $provide) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: "SearchCtrl as ctrl"
      }
    }
  })
  .state('app.view-milestone', {
    url: "/view-milestone/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/view-milestone.html",
        controller: "MilestoneViewCtrl as ctrl"
      }
    },
    resolve: {
      milestoneResponse: function($q, $stateParams, milestoneService) {
        var d = $q.defer();

        milestoneService.getMilestone($stateParams.id).then(function(milestone) {
          d.resolve(milestone);
        }, function error(err) {
          if (err.status === 403 || err.status === 401) {
            d.resolve([]);
          } else {
            d.reject(err);
          }
        });

        return d.promise;
      }
    }
  })
  .state('app.edit-milestone', {
    url: "/edit-milestone/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/edit-milestone.html",
        controller: "MilestoneEditCtrl as ctrl"
      }
    }
  })
  .state('app.create-milestone', {
    url: "/create-milestone",
    views: {
      'menuContent': {
        templateUrl: "templates/create-milestone.html",
        controller: "MilestoneEditCtrl as ctrl"
      }
    }
  })
  .state('app.list', {
    url: "/milestone-list",
    views: {
      'menuContent': {
        templateUrl: "templates/milestone-list.html",
        controller: 'MilestoneListCtrl as ctrl'
      }
    },
    resolve: {
      milestoneListResponse: function($q, milestoneService) {
        var d = $q.defer();

        milestoneService.getMilestoneList().then(function success(s) {
          d.resolve(s);
        }, function error(err) {
          if (err.status === 403 || err.status === 401) {
            d.resolve([]);
          } else {
            d.reject(err);
          }
        });

        return d.promise;
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/milestone-list');



  $provide.factory('loginRedirectInterceptor', function($rootScope, $q) {
    return {
      responseError: function(r) {
        if (r.status === 401 || r.status === 403) {
          $rootScope.$broadcast('displayLoginDialog');
          return $q.reject(r);
        }
        else {
          return $q.reject(r);
        }
      }
    }
  });

  $httpProvider.interceptors.push('loginRedirectInterceptor');
})

.constant('milestoneTypes', [
  {name:'Firsts', iconClass:'ion-arrow-graph-up-right'},
  {name:'Happy Moment', iconClass:'ion-happy'},
  {name:'Event', iconClass:'ion-calendar'},
  {name:'Achievement', iconClass:'ion-ribbon-a'}
]);
