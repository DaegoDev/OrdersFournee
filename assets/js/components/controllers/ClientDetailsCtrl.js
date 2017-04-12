(function() {
  var fournee = angular.module('fournee');
  fournee.controller('ClientDetailsCtrl',
  ['$scope', '$log','$state' ,'$stateParams', 'ClientSvc', 'productSvc', clientDetailsCtrl]);

  function clientDetailsCtrl($scope, $log, $state, $stateParams, ClientSvc, productSvc) {
    $scope.client = $stateParams.client;
    $scope.selectedProducts = [];

    if (!$scope.client) {
      $state.go('client.list');
    } else {
      getClientProducts();
    }

    // Function to enable the products selected to the current client.
    $scope.enableProducts = function () {
      var productCodes = [];
      var client = {};
      angular.forEach($scope.selectedProducts, function (product, key) {
        productCodes.push(product.code);
      })

      client.clientId = $scope.client.id;
      client.products = productCodes;
      ClientSvc.enableProducts(client)
        .then(function (res) {
          $scope.hideProducts();
          getClientProducts();
        })
        .catch(function (err) {
          $log.error('Can\'t enable the products, have you selected at least one product?');
        });;
    }

    // Function to disable/delete the current client.
    $scope.disableClient = function () {
      ClientSvc.disableClient({clientId: $scope.client.id})
        .then(function (res) {
          $scope.client.user.state = 0;
          $log.debug(res);
        })
        .catch(function (err) {
          $log.error('The client has not been disabled.');
        });
    }

    // Function to show the module of product list to enable products.
    $scope.showProducts = function () {
      $scope.enablingProduct = true;
      $scope.selectedProducts = [];
      // Service call to get all products.
      productSvc.getProducts()
        .then(function (res) {
          $scope.products = res.data;
          // We show only those products that are not enabled yet.
          angular.forEach($scope.products, function(product, i) {
            angular.forEach($scope.client.products, function(clientProduct, j) {
              if (clientProduct.product.code == product.code) {
                $scope.products[i].hide = true;
              }
            });
          });
        })
        .catch(function (err) {
          $log.error('Can\'t get product list');
        });
    }

    // Function to hide the module of product list;
    $scope.hideProducts = function () {
      $scope.enablingProduct = false;
    }

    // Function to select a product, hide it from the list and show it in the
    // selected products.
    $scope.selectProduct = function(product) {
      var index = $scope.selectedProducts.indexOf(product);
      if (index == -1) {
        $scope.selectedProducts.push(product);
        product.hide = true;
      }
    }

    //Function to un-select deselect a product from the selected products and
    // show it back on the product list.
    $scope.deselectProduct = function (product) {
      var index = $scope.selectedProducts.indexOf(product);
      if (index != -1) {
        $scope.selectedProducts.splice(index,1);
        product.hide = false;
      }
    }

    // Function to get all products enabled for a client, it is not linked to $scope.
    function getClientProducts() {
      $scope.client.products = null;
      ClientSvc.getProductsClient({
        clientId: $scope.client.id
      })
      .then(function(res) {
        $scope.client.products = res.data.clientProducts;
      })
      .catch(function (err) {
        $log.error('Cant\' get the client products.');
      });;
    }
  }
}())