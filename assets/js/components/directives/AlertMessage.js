(function(){
  var fournee = angular.module('fournee');

  fournee.directive('alertMessage', function () {
    return {
      restric: 'EA',
      templateUrl: 'templates/public/alert-message.html',
      scope : {
        options: '=',
      },
      controller: 'alertMessageCtrl'
    }
  })

  fournee.controller('alertMessageCtrl', ['$scope', '$log', alertMessageCtrl]);

  // Function to close the alert.
  function alertMessageCtrl($scope, $log) {
    $scope.close = function () {
      $scope.options.showMessage = false;
    }
  }
}())
