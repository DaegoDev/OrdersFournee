(function() {
  var fournee = angular.module('fournee');
  fournee.controller('productListCtrl', ['$scope', '$log', 'productSvc', clientCreateCtrl]);

  function clientCreateCtrl($scope, $log, productSvc) {
    productSvc.getProducts()
      .then(function(res) {
        $scope.products = res.data;
        console.log($scope.products);

      });
    $scope.lista = [];

    $scope.selectProduct = function(product) {
      $scope.lista.push(product);
    }
    
  }

}())
