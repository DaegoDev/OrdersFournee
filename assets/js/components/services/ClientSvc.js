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
    }
  };
}]);
