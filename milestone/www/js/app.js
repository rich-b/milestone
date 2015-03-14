// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('milestone', ['ionic', 'milestone.controllers', 'milestone.services', 'milestone.filters', 'angular-carousel'])

.run(function($ionicPlatform) {
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
})

.config(function($stateProvider, $urlRouterProvider) {
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
        templateUrl: "templates/search.html"
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
        controller: "MilestoneEditCtrl"
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
    }
  })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/milestone-list');
})

.constant('milestoneTypes', [
  {name:'Firsts', iconClass:'ion-arrow-graph-up-right'},
  {name:'Happy Moment', iconClass:'ion-happy'},
  {name:'Event', iconClass:'ion-calendar'},
  {name:'Achievement', iconClass:'ion-ribbon-a'}
]);
