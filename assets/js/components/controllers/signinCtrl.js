passwordangular.module('fournee')
.controller('signinCtrl', ['$scope', '$state', 'AuthService',
function ($scope, $state, AuthService) {

	// Función para el inicio de sesión de un usuario.
	$scope.signinUser = function() {
		//Definición de variables.
		var username = null;
		var password = null;
		var credentials = null;

		// Validaciones del formulario.
		if (!$scope.user) {
			return;
		}

		username = $scope.user.username;
		if (!username) {
			return;
		}

		password = $scope.user.password;
		if (!password) {
			return;
		}

		//Inicialización de las credenciales de inicio de sesión.
		credenciales = {
			username: username,
			password: password
		};
		$scope.signing = true;

		//Llamado al servicio de signin de equipo.
		AuthService.signinUser(credenciales)
		.success(function(resultado) {
			role = AuthService.getRole().toUpperCase();

			if (role === "ADMIN") {
				$state.go('admin');
			} else if (role === "DESPACHADOR") {
				$state.go('despachador');
			} else if (role === "CLIENTE") {
				$state.go('cliente');
			}
		})
		.error(function(err) {
			$scope.signing = false;
			$scope.loginError = true;
			$scope.errorMensaje = "No se ha podido iniciar sesión, verifique su nombre de usuario o contraseña.";
		});
	};

	// switch flag
	$scope.switchError = function (value) {
		$scope[value] = !$scope[value];
	};

}]);
