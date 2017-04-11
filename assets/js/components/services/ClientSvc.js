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
    // Service to get the client employees
    getClientEmployees: function() {
      var clientEmployees = $http({
        url: '/clientemployee/getEmployeesByClient',
        method: 'GET',
      });
      return clientEmployees;
    }
  };
}]);
