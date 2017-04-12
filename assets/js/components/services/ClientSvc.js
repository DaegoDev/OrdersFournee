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

    //service to disable a client.
    disableClient: function(client) {
      var msg = $http({
        url: '/client/delete',
        method: 'PUT',
        params: client
      });
      return msg;
    },

    // service to get all de products available to a client.
    getProductsClient: function(client) {
      var products = $http({
        url: '/client/getProductsEnabled',
        method: 'GET',
        params: client
      });
      return products;
    },

    // service to enable a list of products to a client.
    enableProducts: function(clientProducts) {
      var client = $http({
        url: '/client/enableProduct',
        method: 'POST',
        params: clientProducts
      });
      return client;
    },
    // service to disable a product to a client.
    disableProduct: function(clientProduct) {
      var client = $http({
        url: '/client/disableProduct',
        method: 'PUT',
        params: clientProduct
      });
      return client;
    },
    // Service to get the client employees.
    getClientEmployees: function() {
      var clientEmployees = $http({
        url: '/clientemployee/getEmployeesByClient',
        method: 'GET',
      });
      return clientEmployees;
    }
  };
}]);
