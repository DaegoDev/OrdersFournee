(function () {
  var fournee = angular.module('fournee');
  fournee.controller('clientCreateCtrl', ['$scope', '$log', 'productSvc', clientCreateCtrl]);

  function clientCreateCtrl($scope, $log, productSvc) {
    $scope.client = [];
    $scope.productCodes = [];
    $scope.productsSelected = [];

    productSvc.getProducts()
      .then(function (res) {
        $scope.products = res.data;
      })

    $scope.selectProduct = function(product) {
      if ($scope.productsSelected.indexOf(product.code) == -1) {
        $scope.productCodes.push(product.code);
        $scope.productsSelected.push(product);
        product.hide = true;
      }
    }
  }

}())
