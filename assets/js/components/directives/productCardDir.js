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

    // Control variables to manage the two type of order products (raw or baked).
    $scope.baked = false;
    $scope.amount = 0;
    var rawProduct = null;
    var bakedProduct = null;

    // Check which type of directive is used, then set the corresponding values.
    if ($scope.type == 'orderProduct') {
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
      $scope.class = ['select'];
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
      var currentProduct = null;
      var name = null;
      if ($scope.amount == 0) {
        return;
      }

      if ($scope.product.customName) {
        name = $scope.product.customName;
      } else {
        name = $scope.product.product.shortName;
      }

      if (!$scope.baked && !rawProduct) {

        rawProduct = {
          client_product: $scope.product.id,
          name: name,
          amount: $scope.amount,
          baked: false
        }
      } else if ($scope.baked && !bakedProduct) {
        bakedProduct = {
          client_product: $scope.product.id,
          name: name,
          amount: $scope.amount,
          baked: true
        }
      }

      if ($scope.baked) {
        currentProduct = bakedProduct;
      } else {
        currentProduct = rawProduct;
      }

      var index = $scope.selectList.indexOf(currentProduct);

      if (index == -1) {
        $scope.selectList.push(currentProduct);
      } else {
        currentProduct.amount += $scope.amount;
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
