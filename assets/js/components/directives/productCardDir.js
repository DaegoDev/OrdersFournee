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

    if ($scope.product.customName) {
      $scope.actualName = $scope.product.customName;
    } else {
      $scope.actualName = $scope.product.shortName;
    }

    // Function to add a product to the list passed as attribute.
    $scope.addProduct = function () {
      var index = $scope.selectList.indexOf($scope.product);
      if (index == -1) {
        if (!$scope.product.amount) {
          $scope.product.amount = 0;
        }
        $scope.product.amount += $scope.amount;
        $scope.selectList.push($scope.product);
      } else {
        $scope.product.amount += $scope.amount;
      }
    }

    // Function to remove a whole product insterted in the list passed as attribute.
    $scope.removeProduct = function () {
      var index = $scope.selectList.indexOf($scope.product);
      if (index != -1) {
        $scope.selectList.splice(index,1);
      }
    }
  }

}())
