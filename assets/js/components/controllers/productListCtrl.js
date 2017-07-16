  var fournee = angular.module('fournee');
  fournee.controller('productListCtrl', ['$scope', '$log', 'productSvc', function($scope, $log, productSvc) {
    productSvc.getProducts()
      .then(function(res) {
        $scope.products = res.data;
      });
    $scope.lista = [];
    
    $scope.selectProduct = function(product) {
      $scope.lista.push(product);
    }

  }]);
