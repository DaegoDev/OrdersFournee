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
        method: 'DELETE',
        params: client
      });
      return msg;
    },

    // service to get all de products available to a client.
    getProductsClient: function() {
      var products = $http({
        url: '/client/getProductsEnabled',
        method: 'GET'
      });
      return products;
    },

    // service to enable a list of products to a client.
    enableProducts: function(clientProducts) {
      var client = $http({
        url: '/client/enableProduct',
        method: 'PUT',
        data: clientProducts
      });
      return client;
    },
    // service to disable a product to a client.
    disableProduct: function(clientProduct) {
      var client = $http({
        url: '/client/disableProduct',
        method: 'PUT',
        data: clientProduct
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
    },
    // Service to validate the information of a client.
    validateInformation: function() {
      var validatedInformation = $http({
        url: '/client/validateInformation',
        method: 'GET',
      });
      return validatedInformation;
    },
    // Service to update the general information of a client.
    updateGeneralInfo: function(credentials) {
      var clientUpdated = $http({
        url: '/client/updateGeneralInfo',
        method: 'PUT',
        data: credentials
      });
      return clientUpdated;
    },
    // Service to update the bill address of a client.
    updateBillAddress: function(credentials) {
      var addressUpdated = $http({
        url: '/client/updateBillAddress',
        method: 'PUT',
        data: credentials
      });
      return addressUpdated;
    },
    // Service to update the delivery address of a client.
    updateDeliveryAddress: function(credentials) {
      var addressUpdated = $http({
        url: '/client/updateDeliveryAddress',
        method: 'PUT',
        data: credentials
      });
      return addressUpdated;
    },
    // Servicio para crear un empleado del cliente.
    createClientEmployee: function(credentials) {
      var create = $http({
        url: '/client/createClientEmployee',
        method: 'POST',
        data: credentials
      });
      return create;
    },
    makeOrder: function (orderCredentials) {
      var order = $http({
        url: '/order/create',
        method: 'POST',
        data: orderCredentials
      });
      return order;
    },
    updateOrder: function (orderCredentials) {
      var order = $http({
        url: '/order/update',
        method: 'PUT',
        data: orderCredentials
      });
      return order;
    },
    changeProductName: function (productCredentials) {
      var product = $http({
        url: '/client/changeProductName',
        methot: 'PUT',
        data: productCredentials
      });
      return product;
    }
  };
}]);
