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
    // Service to get all existing products.
    getProducts: function() {
      var products = $http({
        url: '/product/getAll',
        method: 'GET'
      });
      return products;
    },
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
