angular.module('fournee')
.factory('productSvc', ['$http', '$rootScope',
function ($http, $rootScope) {
  return {
    // Service to create a product.
    createProduct: function(credentials) {
      var create = $http({
        url: '/product/create',
        method: 'POST',
        params: credentials
      });
      return create;
    },
    // Enables a given product.
    enableProduct: function (credentials) {
      var product = $http({
        url: '/product/enableProduct',
        method: 'PUT',
        params: credentials
      });
      return product;
    },
    // Disables a given product.
    disableProduct: function (credentials) {
      var product = $http({
        url: '/product/disableProduct',
        method: 'PUT',
        params: credentials
      });
      return product;
    },
    // Service to get all existing products that are enabled.
    getProducts: function() {
      var products = $http({
        url: '/product/getAllEnabled',
        method: 'GET'
      });
      return products;
    },
    // Service to get all existing products that are disabled.
    getProductsDisabled: function () {
      var products = $http({
        url: '/product/getAllDisabled',
        method: 'GET'
      });
      return products;
    },
    // Service to get the products of a client.
    getProductsByClient: function (client) {
      var products = $http({
        url: '/product/getProductsByClient',
        method: 'GET',
        params: client
      });
      return products;
    }
  };
}]);
