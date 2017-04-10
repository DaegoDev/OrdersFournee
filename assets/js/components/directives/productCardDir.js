(function(){
  var fournee = angular.module('fournee');

  fournee.directive('productCard', function () {
    return {
      restric: 'E',
      templateUrl: 'templates/private/shared/product-card.html',
      scope : {
        product: '=',
        type: '@?',
        selectList: '=?'
      },
      controller: 'productCardCtrl'
    }
  })

  fournee.controller('productCardCtrl', ['$scope', '$log', productCardCtrl]);

  function productCardCtrl($scope, $log) {
    var product = $scope.product;
    if ($scope.product.customName) {
      $scope.actualName = $scope.product.customName;
    } else {
      $scope.actualName = $scope.product.shortName;
    }
  }

  $scope.selectProduct = function () {
    $scope.selectList.push(product);
  }
}())
