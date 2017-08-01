(function () {
  var fournee = angular.module('fournee');

  fournee.controller('productDisableCtrl', ['$scope', '$log', '$state', '$ngConfirm', 'productItemSvc', 'productSvc',
  function ($scope, $log, $state, $ngConfirm, productItemSvc, productSvc) {

    $scope.productsEnabled = [];
    $scope.productsDisabled = [];

    productSvc.getProducts()
    .then(function (productsData) {
      $scope.productsEnabled = productsData.data;
    })
    .catch(function (err) {
      console.log(err);
    });

    productSvc.getProductsDisabled()
    .then(function (productsData) {
      $scope.productsDisabled = productsData.data;
    })
    .catch(function (err) {
      console.log(err);
    });

    $scope.disableProduct = function (product) {
      productSvc.disableProduct({productCode: product.code})
      .then(function (dataResponse) {
        var index = $scope.productsEnabled.indexOf(product);
        $scope.productsEnabled.splice(index, 1);
        $scope.productsDisabled.unshift(product);
      })
      .catch(function (err) {
        console.log(err);
      });
    }

    $scope.enableProduct = function (product) {
      productSvc.enableProduct({productCode: product.code})
      .then(function (dataResponse) {
        var index = $scope.productsDisabled.indexOf(product);
        $scope.productsDisabled.splice(index, 1);
        $scope.productsEnabled.unshift(product);
      })
      .catch(function (err) {
        console.log(err);
      });
    }

  }])
})();
