angular.module('fournee')
.factory('SignupService', ['$http', '$rootScope',
function ($http, $rootScope) {
  var storageTipo = 'session';

  return {
    // Servicio para registrar un cliente.
    signupClient: function(credentials) {
      var signup = $http({
        url: '/client/signup',
        method: 'POST',
        data: credentials
      });
      return signup;
    },

    // Service to validate if a client already exits.
    validateClient: function (clientInfo) {
      var client = $http({
        url: '/client/validateClient',
        method: 'GET',
        params: clientInfo
      });
      return client;
    },

    // Servicio para registrar un empleado.
    signupEmployee: function(credentials) {
      var signup = $http({
        url: '/employee/signup',
        method: 'POST',
        data: credentials
      });
      return signup;
    },
  };
}]);
