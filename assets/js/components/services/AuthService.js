angular.module('fournee')
.factory('AuthService', ['$http', '$rootScope', 'StorageService','PermRoleStore',
function($http, $rootScope, StorageService, PermRoleStore){
var storageType = 'session';

	return {
		// Servicio para el inicio de sesión de un usuario.
		signinUser: function(credentials) {
			var role = null;
			var signin = $http({
				url: '/auth/signinUser',
				method: 'POST',
				params: credentials
			});

			signin.then(function(res) {
				console.log(res.data);
				console.log(res);
				// Creación de la sesión de un equipo cuando las credenciales son validas.
				role = res.data.role.toUpperCase();
				PermRoleStore.clearStore();
				PermRoleStore.defineRole(role, function () {return true;});
				PermRoleStore.defineRole('ANON', function () {return false;});
				StorageService.set("auth_token", res.data.token, storageType);
				StorageService.set("role", role, storageType);
				$rootScope.$broadcast('renovateRole');
			});
			return signin;
		},

		// Servicio para el cierre de sesión de cualquier usuario.
		signout: function() {
			// Terminación de la sesión de un usuario.
			PermRoleStore.clearStore();
			PermRoleStore.defineRole("ANON", function () {return true;})
			StorageService.unset("auth_token", storageType);
			StorageService.unset("role", storageType);
			$rootScope.$broadcast('renovateRole');
		},

		// Servicio para autenticar una sesión de usuario activa.
		isAuthenticated: function() {
			var role = StorageService.get("role", storageType);
			if (!role) {
				return false;
			}
			if(role == "ANON"){
				return false;
			}
			return true;
		},

		// Servicio para obtener el tipo de rol del usuario de la sesión actual.
		getRole: function(){
			return StorageService.get("role", storageType);
		},

	};
}]);

//Interceptor de peticiones para authorización de usuarios.
angular.module('fournee')
.factory('AuthInterceptor', ['$q', '$injector', '$rootScope', function($q, $injector, $rootScope) {
	var StorageService = $injector.get('StorageService');
	var PermRoleStore = $injector.get('PermRoleStore');
	var storageType = 'session';

	return {
		request: function(config) {
			var token = null;

			if (StorageService.get('auth_token', storageType)) {
				token = StorageService.get('auth_token', storageType);
			}
			if (token) {
				config.headers.authorization = 'JWT ' + token;
			}
			return config;
		},

		responseError: function(response) {
			if (response.status === 401 || response.status === 403) {
				StorageService.unset('auth_token', storageType);
				StorageService.unset('role', storageType);
				PermRoleStore.clearStore();
				PermRoleStore.defineRole('ANON', function () {return true;});
				$rootScope.$broadcast('renovateRole');
				$injector.get('$state').go('home');
			}
			return $q.reject(response);
		}
	};
}])
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
}]);
