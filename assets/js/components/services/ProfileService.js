angular.module('fournee')
.factory('ProfileService', ['$http', function($http) {
	return {

		// Servicio para obtener el perfil de un empleado con el rol de administrador o despachador.
		getProfileEmployee: function() {
			var profile = $http({
				url: '/employee/getProfile',
				method: 'GET',
			});
			return profile;
		},

		// servicio para obtener el perfil de un cliente.
    getProfileClient: function() {
      var profile = $http({
        url: '/client/getProfile',
        method: 'GET',
      });
      return profile;
    },

		// Servicio para cambiar la contraseña de un empleado con rol de administrador o despachador.
		employeeChangePsw: function(credentials) {
			var changePsw = $http({
        url: '/employee/updatePassword',
        method: 'PUT',
				data: credentials
      });
      return changePsw;
		},

		// Servicio para cambiar la contraseña de un cliente.
		clientChangePsw: function(credentials) {
			var changePsw = $http({
				url: '/client/updatePassword',
				method: 'PUT',
				data: credentials
			});
			return changePsw;
		},
	};
}]);
