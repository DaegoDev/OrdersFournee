var fournee = angular.module('fournee');

fournee.directive('alertMessage', function() {
  return {
    restric: 'EA',
    templateUrl: 'templates/public/alert-message.html',
    scope: {
      options: '=',
    },
    controller: 'alertMessageCtrl'
  }
})

// Function to close the alert.
fournee.controller('alertMessageCtrl', ['$scope', '$log', function($scope, $log) {
  $scope.close = function() {
    $scope.options.showMessage = false;
  }
}]);
