(function() {
  var fournee = angular.module('fournee');
  fournee.controller('productItemsCtrl', ['$scope', '$log', 'productItemSvc', productItemsCtrl]);

  function productItemsCtrl($scope, $log, productItemSvc) {

    productItemSvc.getAll()
      .then(function(res) {
        $scope.items = res.data
      });
  }
}())
