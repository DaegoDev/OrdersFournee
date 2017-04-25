  var fournee = angular.module('fournee');
  fournee.controller('EmployeeListCtrl', ['$scope', '$log', '$state', '$ngConfirm', 'EmployeeSvc', function($scope, $log, $state, $ngConfirm, EmployeeSvc) {

    EmployeeSvc.getEmployees()
      .then(function(res) {
        $scope.employees = res.data;
      });

    $scope.confirm = function(employeeId) {
      $ngConfirm({
        title: '¿Realmente desea desactivar el empleado?',
        useBootstrap: true,
        content: 'Este dialogo eligirá la opción cancelar automaticamente en 6 segundo si no responde.',
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
      EmployeeSvc.deleteEmployee({
          employeeId: employeeId
        })
        .then(function(res) {
          angular.forEach($scope.employees, function (employee, key) {
            if(employee.id == res.data.id){
              employee.state = 'Inactivo';
            }
          })
          $ngConfirm('Usuario desactivado.');
          $state.go('employee.list')
        })
        .catch(function(err) {
          $ngConfirm('No se pudo desactivar el usuario.');
        })
    }

    $scope.sortBy = function (name) {
      $scope.sortByProperty = name;
      $scope.sortReversed = ($scope.sortByProperty === name) ? !$scope.sortReversed : false;
    }
  }]);
