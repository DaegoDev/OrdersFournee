(function(){
  var fournee = angular.module('fournee');

  fournee.directive('productCard', function () {
    return {
      restric: 'E',
      templateUrl: 'templates/private/shared/product-card.html',
      scope : {
        product: '=',
        type: '@',
        selectList: '=?'
      },
      controller: 'productCardCtrl'
    }
  })

  fournee.controller('productCardCtrl', ['$scope', '$log', productCardCtrl]);

  function productCardCtrl($scope, $log) {
    // Control variables to manage the behaviour of the directive base on the type value.
    $scope.dirProduct = null;
    $scope.clientProduct = null;
    $scope.name = '';

    // Check which type of directive is used, then set the corresponding values.
    if ($scope.type == 'amount') {
      $scope.dirProduct = $scope.product.product;
      $scope.clientProduct = {
        clientId: $scope.clientId,
        clientProductId: $scope.id
      }
      if ($scope.product.customName) {
        $scope.name = $scope.product.customName;
      } else {
        $scope.name = $scope.dirProduct.shortName;
      }
    }

    else if ($scope.type == 'select') {
      $scope.dirProduct = $scope.product;
      $scope.name = $scope.product.shortName;
    }

    else if ($scope.type == 'list') {
      $scope.class = ['list'];
      $scope.dirProduct = $scope.product;
      $scope.name = $scope.product.shortName;
    }

    // Function to change the product's name of a client.
    $scope.changeName = function () {

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
