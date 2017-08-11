angular.module('fournee')
.factory('productSvc', ['$http', '$rootScope',
function ($http, $rootScope) {
  return {
    // Service to create a product.
    createProduct: function(credentials) {
      var create = $http({
        url: '/product/create',
        method: 'POST',
        data: credentials
      });
      return create;
    },
    // Updates the items of a product.
    updateProduct: function (credentials) {
      var product = $http({
        url: '/product/update',
        method: 'PUT',
        data: credentials
      });
      return product;
    },
    // Enables a given product.
    enableProduct: function (credentials) {
      var product = $http({
        url: '/product/enableProduct',
        method: 'PUT',
        data: credentials
      });
      return product;
    },
    // Disables a given product.
    disableProduct: function (credentials) {
      var product = $http({
        url: '/product/disableProduct',
        method: 'PUT',
        data: credentials
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
