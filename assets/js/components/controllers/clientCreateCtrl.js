(function () {
  var fournee = angular.module('fournee');
  fournee.controller('clientCreateCtrl', ['$scope', '$log', clientCreateCtrl]);

  function clientCreateCtrl($scope, $log) {
    $scope.client = [];

    $scope.test = function () {
      alert("working")
    }
  }

}())
