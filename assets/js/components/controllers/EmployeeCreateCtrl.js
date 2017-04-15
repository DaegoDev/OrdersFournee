(function() {
  var fournee = angular.module('fournee');
  fournee.controller('EmployeeCreateCtrl', ['$scope', '$log', '$state', '$ngConfirm', 'SignupService', employeeCreateCtrl]);

  function employeeCreateCtrl($scope, $log, $state, $ngConfirm, SignupService) {
    $scope.employee = {};

    // Dropdown para listar los tipos de empleados
    $scope.placement = {
      options: ['Administrador',
        'Despachador'
      ],
      selected: 'Administrador',
    };

    $scope.createEmployee = function() {
      var name = null;
      var role = null;
      var username = null;
      var password = null;
      var rePassword = null;

      if (!$scope.employee) {
        return;
      }

      name = $scope.employee.name;
      role = $scope.placement.selected.toLowerCase();
      username = $scope.employee.username;
      password = $scope.employee.password;
      rePassword = $scope.employee.rePassword;

      // Validación de los campos del formulario de registro del empleado.
      if (!name || !username || !role || !password) {
        return;
      }

      if (name.length > 50) {
        return;
      }

      if (password.length < 6 || password !== rePassword) {
        return;
      }

      var employeeCredentials = {
        name: name,
        role: role,
        username: username,
        password: password
      }

      $scope.signinup = true;
      SignupService.signupEmployee(employeeCredentials)
        .then(function(res) {
          // $scope.alertMessage = "Empleado creado!";
          $scope.signingUp = false;
          $scope.signupError = false;
          // $scope.showAlert = true;
          $scope.signup.$setPristine();
          $scope.signup.$setUntouched();

          console.log(name);
          $ngConfirm({
            title: 'Empleado guardado correctamente!',
            content: 'Notifiquele las credenciales de autenticación asignadas.\
            <br\>\
            <strong>Nombre de usuario: </strong>' + username +'\
            <br\>\
            <strong>Contraseña: </strong>' + password ,
            type: 'green',
            typeAnimated: true,
            columnClass: 'medium',
            buttons: {
              showEmployees: {
                text: 'Mostrar empleados',
                btnClass: 'btn-blue',
                action: function() {
                  $state.go('employee.list');
                }
              },
              addEmployee: {
                text: 'Nuevo empleado',
                btnClass: 'btn-green',
                action: function() {
                  $scope.employee= {};
                  $scope.$apply();
                }
              }
            }
          });
        })
        .catch(function(err) {
          if (err.status === 409) {
            $scope.alertMessage = "Error, el nombre de usuario ya está registrado."
          } else {
            $scope.alertMessage = "No se ha podido crear el empleado.";
          }
          $scope.signingUp = false;
          $scope.signupError = true;
          $scope.showAlert = true;
        })
    }

    // switch flag
    $scope.switchAlert = function(value) {
      $scope[value] = !$scope[value];
    };

  }
}())
