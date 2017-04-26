
  var fournee = angular.module('fournee');
  fournee.controller('EmployeeProfileCtrl', ['$scope', '$log', '$state', '$stateParams', 'ProfileService', 'EmployeeSvc', '$ngConfirm', function($scope, $log, $state, $stateParams, ProfileService, EmployeeSvc, $ngConfirm) {
    $scope.user = {};

    ProfileService.getProfileEmployee()
      .then(function(res) {
        // console.log(res.data);
        $scope.employee = res.data;
      })
      .catch(function(err) {
        $ngConfirm('No se ha podido obtener el perfil. Intente mas tarde');
      })

    $scope.updateEmployee = function() {
      var name = $scope.employee.name;

      var employeeCredentials = {
        name: name,
      }

      // Validación de los campos del formulario de actualización de un empleado.
      if (!name) {
        return;
      }

      EmployeeSvc.updateInformation(employeeCredentials)
        .then(function(res) {
          var employeeUpdated = res.data;
          $scope.employee.name = employeeUpdated.name;
          $scope.alertMessageEmployee = "Información actualizada!";
          $scope.signingUp = false;
          $scope.signupError = false;
          $scope.showAlertEmployee = true;
          $scope.update.$setPristine();
          $scope.update.$setUntouched();
        })
        .catch(function(err) {
          console.log(err);
          $scope.alertMessageEmployee = "No se ha podido actualizar la información.";
          $scope.signingUp = false;
          $scope.signupError = true;
          $scope.showAlertEmployee = true;
        })
    }

    $scope.updatePassword = function() {
      // Definición de variables.

      var currentPassword = null;
      var newPassword = null;
      var rePassword = null;
      var credentials = null;

      if (!$scope.user) {
        return;
      }

      // Inicialicación de datos para el cambio de la contraseña de un equipo.
      currentPassword = $scope.user.currentPassword;
      newPassword = $scope.user.newPassword;
      rePassword = $scope.user.rePassword;

      // Validación de los campos del formulario de cambiar contraseña del equipo.
      if (!currentPassword || !newPassword || !rePassword) {
        return;
      }

      if (newPassword.length < 6 || newPassword !== rePassword) {
        return;
      }

      if (newPassword === currentPassword) {
        $scope.alertMessagePassword = "Error, la contraseña nueva no puede ser igual a la contraseña actual.";
        $scope.error = true;
        $scope.showAlertPassword = true;
        return;

      }

      credentials = {
        currentPassword: currentPassword,
        newPassword: newPassword
      };

      // Llamado al servicio de cambiar contraseña de equipos haciendo uso de las credenciales
      // creadas y validadas.
      $scope.processing = true;
      ProfileService.employeeChangePsw(credentials)
        .then(function(res) {
          $scope.alertMessagePassword = "La contraseña ha sido cambiada exitosamente.";
          $scope.processing = false;
          $scope.error = false;
          $scope.showAlertPassword = true;
          $scope.user = {};
          $scope.pswForm.$setPristine();
          $scope.pswForm.$setUntouched();
        })
        .catch(function(err) {
          console.log(err);
          $scope.alertMessagePassword = "La contraseña no ha sido cambiada, verifique su contraseña actual.";
          $scope.processing = false;
          $scope.error = true;
          $scope.showAlertPassword = true;
        });
    }

    // switch flag
    $scope.switchAlert = function(value) {
      // console.log(value);
      $scope[value] = !$scope[value];
    };
  }]);
