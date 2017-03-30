angular.module('fournee')
.factory('SignupService', ['$http', '$rootScope',
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
  };
}]);
