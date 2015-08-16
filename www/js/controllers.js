angular.module('milestone.controllers', ['milestone.filters'])

.controller('AppCtrl', function($scope, $ionicModal, $state, userService) {

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
})

.controller('MilestoneListCtrl', function($scope, $location, $state, milestoneService, ngNotify) {
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
    }, handleError);
  };

  this.moreMilestonesExist = function() {
    return self.milestones && self.milestones.length < self.totalResultCount;
  };

  this.loadMoreMilestones = function() {
    milestoneService.getMilestoneList('', self.milestones.length).then(function(response) {
      Array.prototype.push.apply(self.milestones, response.results);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');
    }, handleError);
  };

  function handleError(err) {
    ngNotify.set(err.data.message || 'Error!', 'error');
  }
})

.controller('MilestoneViewCtrl', function($scope, $location, $state, $timeout) {
  this.milestoneModel = {images:[]};
  var self = this;

  // workaround to watch when the list resolve is refreshed
  $scope.$state = $state;
  $scope.$watch('$state.$current.locals.globals.milestoneResponse', function(milestoneResponse) {
    self.milestoneModel = milestoneResponse;
    if (self.milestoneModel.images && self.milestoneModel.images.length > 0) {
      $timeout(function() {
        self.carouselIndex = _.findIndex(self.milestoneModel.images, {isDefault: true});
      });
    }
  });

  self.edit = function(item) {
    $location.path('/app/edit-milestone/' + self.milestoneModel.id);
  };
})

.controller('MilestoneViewImageCtrl', function(image) {
  this.image = image;
})

.controller('MilestoneEditCtrl', function(
    $rootScope,
    $filter,
    $location,
    $stateParams,
    milestoneTypes,
    milestoneService,
    pictureService,
    ngNotify
) {
  this.milestoneModel = {};
  this.isNew = true;
  this.displayTab = 'details';
  this.milestoneTypes = milestoneTypes;

  if (_.isUndefined($stateParams.id) || $stateParams.id === '') {
    this.milestoneModel = {
      date: new Date(), //new Date($filter("date")(Date.now(), 'yyyy-MM-dd')),
      images: []
    };
  } else {
    milestoneService.getMilestone($stateParams.id).then(function(milestone) {
      this.milestoneModel = milestone;
    }.bind(this));

    this.isNew = false;
  }

  this.save = function() {
    if (this.isNew) {
      milestoneService.addMilestone(self.milestoneModel).then(function success() {
        $location.path('/app/milestone-list');
      }, handleError);
    } else {
      milestoneService.updateMilestone(self.milestoneModel).then(function success() {
        $location.path('/app/milestone-list');
      }, handleError);
    }
  };

  $rootScope.$on('PICTURE_TAKEN', function(event, encodedImage) {
    pictureService.upload(encodedImage).then(function(response) {
      this.milestoneModel.images.push({
        src: response.imageUrl
      });
      ngNotify.set('Image successfully added', 'success');
    }.bind(this));
  });

  this.fileToUploadClick = function() {
    // hack that might work to prevent image capture crashes
    $('fileToUpload').val('');
  };

  this.fileSelected = function() {
    var f = document.getElementById('fileToUpload').files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      var dataUrl = reader.result;
      var img = dataUrl.substring(dataUrl.indexOf(',')+1);

      pictureService.upload(img).then(
        function success(response) {
          this.milestoneModel.images.push({
            src: response.imageUrl
          });
          ngNotify.set('Image successfully added', 'success');
        }.bind(this), handleError
      );
    };

    reader.onerror = function(e) {
      ngNotify.set('Error reading file: ' + reader.error, 'error');
    };

    reader.readAsDataURL(f);
  };

  this.takePicture = function() {
    $rootScope.showCamera = true;
  };

  this.openFileDialog = function() {
    ionic.trigger('click', {target: document.getElementById('fileToUpload')});
  };

  this.addPictureUrl = function() {
    if (this.newImageUrl && this.newImageUrl.length > 0) {
      this.milestoneModel.images.push({
        src: this.newImageUrl
      });

      this.newImageUrl = '';
      this.carouselIndex = this.milestoneModel.images.length - 1;
    }
  };

  this.removePicture = function() {
    this.milestoneModel.images.splice(this.carouselIndex, 1);
  };

  this.defaultImageChanged = function(imageIndex) {
    var currentImage = this.milestoneModel.images[imageIndex];
    var newDefaultValue = currentImage.isDefault;
    if (newDefaultValue) {
      _.each(this.milestoneModel.images, function(img) {
        if (img !== currentImage) {
          img.isDefault = false;
        }
      });
    }
  };

  function handleError(err) {
    var message = _.get(err, 'data.message') || err;
    ngNotify.set(message, 'error');
  }

})

.controller('SearchCtrl', function(pictureService) {
  //pictureService.get();
});
