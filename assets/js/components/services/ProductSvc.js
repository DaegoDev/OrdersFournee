angular.module('fournee')
.factory('productSvc', ['$http', '$rootScope',
function ($http, $rootScope) {
  return {
    // Servicio para crear un producto.
    createProduct: function(credentials) {
      var create = $http({
        url: '/product/create',
        method: 'POST',
        params: credentials
      });
      return create;
    },
    getProducts: function(items) {
      var create = $http({
        url: '/product/getAll',
        method: 'GET',
        params: items
      });
      return create;
    },
  };
}]);
