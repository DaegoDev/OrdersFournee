angular.module('fournee')
.factory('RecoverPasswordSvc', ['$http', function($http){
	return {
		// Inicia el proceso de recuperación de contraseña de un profesor.
		startRecover: function (params) {
			var user = $http({
				url: '/auth/requestTokenRecovery',
				method: 'GET',
				params: params
			});
			return user;
		},

		// Servicio que recupera la contraseña.
		recoverPassword: function (credentials, token) {
			var company = $http({
				url: '/auth/recoverPassword',
				method: 'PUT',
				params: credentials,
				headers: {
					Authorization: 'JWT ' + token,
				}
			});
			return company;
		},

	};
}]);
