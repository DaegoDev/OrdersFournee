(function() {
  var fournee = angular.module('fournee');

  fournee.directive('loginForm', function() {
    return {
      restric: 'E',
      require: '^sidebar',
      templateUrl: 'templates/public/login.html',
      controller: 'loginCtrl',
      link: function(scope, element, attrs, parentCtrl) {
        scope.toggleSidebar = parentCtrl.toggleSidebar;
      }
    }
  })

  fournee.controller('loginCtrl', ['$scope', '$state', 'AuthService', '$cookieStore', '$log', loginCtrl]);

  function loginCtrl($scope, $state, AuthService, $cookieStore, $log) {
    $scope.focus = function() {
      $scope.toggleSidebar();
      console.log(document.getElementById('testlog'))
      document.getElementById('testlog').focus();
    }
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
      credentials = {
        username: username,
        password: password
      };
      $scope.signing = true;

      //Llamado al servicio de signin de usuario.
      AuthService.signinUser(credentials)
        .then(function(result) {
          role = AuthService.getRole().toUpperCase();

          if (role === "ADMIN") {
            $state.go('admin');
          } else if (role === "DESPACHADOR") {
            $state.go('despachador');
          } else if (role === "CLIENTE") {
            $state.go('clienteRole');
          }
        })
        .catch(function(err) {
          console.log(err);
          $scope.signing = false;
          $scope.loginError = true;
          $scope.errorMessage = "No se ha podido iniciar sesión, verifique su nombre de usuario o contraseña.";
        });
    };

    // switch flag
    $scope.switchError = function(value) {
      $scope[value] = !$scope[value];
    };
  }
}())
