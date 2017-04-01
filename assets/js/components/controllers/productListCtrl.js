(function () {
  var fournee = angular.module('fournee');
  fournee.controller('productListCtrl', ['$scope', '$log','productSvc', clientCreateCtrl]);

  function clientCreateCtrl($scope, $log, productSvc) {
    productSvc.getProducts()
      .then(function (res) {
        $scope.products = res.data;
      });
  }

}())
