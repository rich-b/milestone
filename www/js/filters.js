angular.module('milestone.filters', [])

.filter('typeIcon', function(milestoneTypes){
  return function(text){
    var matchingType = _.find(milestoneTypes, {name: text});
    if (!matchingType) return '';

    return matchingType.iconClass;
  };
});