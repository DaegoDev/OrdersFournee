var arketops = angular.module('fournee');
arketops.controller('RecoverPasswordCtrl', ['$scope', '$log', '$ngConfirm', '$state',
  'RecoverPasswordSvc',
  function($scope, $log, $ngConfirm, $state, RecoverPasswordSvc) {

    // Función para iniciar el proceso de recuperar la contraseña de una empresa.
    $scope.getToken = function() {
      //Definición de variables.
      var email = null;
      var credentials = null;
      // Validaciones del formulario.
      email = $scope.user.email;
      console.log(email);
      if (!email) {
        return;
      }
      credentials = {
        email: email
      };
      $scope.sending = true;
      RecoverPasswordSvc.startRecover(credentials)
        .then(function(res) {
          $scope.token = res.data;
          $scope.sending = false;
          $scope.waitingCode = true;
          $scope.user = {};
        })
        .catch(function(err) {
          $scope.messageAlert = "Error, el correo electrónico ingresado no existe.";
          $scope.recoverError = true;
          $scope.showAlert = true;
          $scope.sending = false;
        });
    }

    // Función para recuperar contraseña de una empresa.
    $scope.recoverPasswordUser = function() {
      //Definición de variables.
      var code = null;
      var request = null;

      // Validaciones del formulario.
      if (!$scope.user) {
        return;
      }
      code = $scope.user.code;
      if (!code) {
        return;
      }

      request = {
        code: code,
      }

      console.log($scope.token);
      $scope.sending = true;
      //Llamado al servicio de recuperar contraseña de una empresa.
      RecoverPasswordSvc.recoverPassword(request, $scope.token)
        .then(function(res) {
          $state.go('home');
          $ngConfirm({
            title: 'Se recuperó la contraseña.',
            content: "Se ha enviado la nueva contraseña a su correo electronico.",
            boxWidth: '30%',
            useBootstrap: false,
            type: 'green',
            typeAnimated: true,
            theme: 'light',
          });
          $scope.user = {};
          $scope.sending = false;
        })
        .catch(function(err) {
          console.log(err);
          $scope.sending = false;
          $scope.messageAlert = "El codigo ingresado es incorrecto.";
          $scope.recoverError = true;
          $scope.showAlert = true;
        });
    };

    // switch flag
    $scope.switchError = function (value) {
      $scope[value] = !$scope[value];
    };

  }
]);
