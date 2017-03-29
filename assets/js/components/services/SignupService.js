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
        params: credentials
      });
      return signup;
    },

    // Servicio para registrar un empleado.
    signupEmployee: function(credentials) {
      var signup = $http({
        url: '/employee/signup',
        method: 'POST',
        params: credentials
      });
      return signup;
    },
  };
}]);
