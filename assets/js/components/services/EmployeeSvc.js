angular.module('fournee')
.factory('EmployeeSvc', ['$http',
function ($http) {
  return {
    // Service to get all employees.
    getEmployees: function() {
      var employees = $http({
        url: '/employee/getAll',
        method: 'GET',
      });
      return employees;
    },
    // Service to deactivate employees.
    deleteEmployee: function(employee) {
      var deleteEmployee = $http({
        url: '/employee/delete',
        method: 'GET',
        params: employee
      });
      return deleteEmployee;
    }
  };
}]);
