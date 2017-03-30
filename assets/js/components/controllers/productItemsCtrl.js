(function () {
  var fournee = angular.module('fournee');
  fournee.controller('productItemsCtrl', ['$scope', '$log', productItemsCtrl]);

  function productItemsCtrl($scope, $log) {
    $scope.items = [
      {nombre: 'masa',
    items: {
      item1: 1,
      item2: 2,
      item3: 3,
    }},
    {nombre: 'forma',
  items: {
    item1: 1,
    item2: 2,
    item3: 3,
  }}
    ];

    $scope.test = function () {
      alert("working")
    }
  }

}())
