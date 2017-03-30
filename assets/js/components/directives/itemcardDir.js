(function(){
  var fournee = angular.module('fournee');

  fournee.directive('itemCard', function () {
    return {
      restric: 'E',
      require: '^sidebar',
      templateUrl: 'templates/private/shared/itemcard.html',
      scope : {item: '='},
      controller: 'itemCard'
    }
  })

  fournee.controller('itemCard', ['$scope', '$log', itemCard]);
  function itemCard($scope,$log) {

  }
}())
