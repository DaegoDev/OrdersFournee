(function() {
  var fournee = angular.module('fournee');
  fournee.controller('EmployeeListCtrl', ['$scope', '$log', '$state', '$ngConfirm', 'EmployeeSvc', employeeListCtrl]);

  function employeeListCtrl($scope, $log, $state, $ngConfirm, EmployeeSvc) {

    EmployeeSvc.getEmployees()
      .then(function(res) {
        $scope.employees = res.data;
      });

    $scope.confirm = function(employeeId) {
      $ngConfirm({
        title: '¿Realmente desea desactivar el empleado?',
        useBootstrap: true,
        content: 'Este dialogo eligirá la opción cancelar automaticamente en 6 segundo si no respondes.',
        autoClose: 'cancel|8000',
        buttons: {
          deleteUser: {
            text: 'Desactivar',
            btnClass: 'btn-red',
            action: function() {
              $scope.disableEmployee(employeeId);
            }
          },
          cancel: function() {
            $ngConfirm('La acción ha sido cancelada');
          }
        }
      });
    }

    $scope.disableEmployee = function(employeeId) {
      console.log(employeeId);
      EmployeeSvc.deleteEmployee({
          employeeId: employeeId
        })
        .then(function(res) {
          $ngConfirm('Usuario desactivado.');
          $state.go('employee.list')
        })
        .catch(function(err) {
          $ngConfirm('No se pudo desactivar el usuario.');
        })
    }
  }
}())
