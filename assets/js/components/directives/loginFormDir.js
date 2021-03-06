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

fournee.controller('loginCtrl', ['$scope', '$state', 'AuthService', '$cookieStore', '$log', '$ngConfirm',
  function($scope, $state, AuthService, $cookieStore, $log, $ngConfirm) {
    $scope.user = {};
    $scope.authenticated = AuthService.isAuthenticated();

    $scope.$on('renovateRole', function(evt) {
      $scope.authenticated = AuthService.isAuthenticated();
    });

    $scope.focus = function() {
      $scope.toggleSidebar();
    }

    $scope.signout = function() {
      AuthService.signout();
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
          $scope.signing = false;
          $scope.user = {};
          $scope.loginError = false;
          $state.go('home');
          var roleName = null;
          role = AuthService.getRole().toUpperCase();
          // if (role === "ADMINISTRADOR") {
          //   // $state.go('admin');
          // } else if (role === "DESPACHADOR") {
          //   $state.go('despachador');
          // } else if (role === "CLIENTE") {
          //   $state.go('clientRole');
          // }
          $ngConfirm({
            title: 'Bienvenido!',
            content: 'Ha iniciado sesión como ' + role + ' en la plataforma de La Fournee.',
            animation: 'top',
            backgroundDismiss: true,
            animationBounce: 1.5,
          })
        })
        .catch(function(err) {
          $scope.user.password = '';
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
]);
