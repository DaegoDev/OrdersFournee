angular.module('fournee')
.factory('ClientSvc', ['$http',
function ($http) {
  return {
    // Service to get all clients.
    getClients: function() {
      var clients = $http({
        url: '/client/getAll',
        method: 'GET',
      });
      return clients;
    },
    disableClient: function(client) {
      var msg = $http({
        url: '/client/delete',
        method: 'PUT',
        params: client
      });
      return msg;
    },
    getProductsClient: function(client) {
      var products = $http({
        url: '/client/getProductsEnabled',
        method: 'GET',
        params: client
      });
      return products;
    },
    enableProducts: function(clientProducts) {
      var client = $http({
        url: '/client/enableProduct',
        method: 'POST',
        params: clientProducts
      });
      return client;
    }
  };
}]);
