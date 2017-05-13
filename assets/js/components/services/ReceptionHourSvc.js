angular.module('fournee')
.factory('ReceptionHourSvc', ['$http', '$rootScope',
function ($http, $rootScope) {
  return {
    // Service to get all existing week days.
    getWeekDays: function() {
      var weekDays = $http({
        url: '/receptionhour/getWeekDays',
        method: 'GET'
      });
      return weekDays;
    },
    // Servicio para crear un horario de recepción.
    createReceptionHour: function(credentials) {
      var create = $http({
        url: '/client/createReceptionHour',
        method: 'POST',
        params: credentials
      });
      return create;
    },
    // Servicio para eliminar un horario de recepción.
    deleteReceptionHour: function(credentials) {
      var deleted = $http({
        url: '/client/deleteReceptionHour',
        method: 'POST',
        params: credentials
      });
      return deleted;
    },
    // Servicio para eliminar un horario de recepción.
    getReceptionHourByClient: function(credentials) {
      var receptionHour = $http({
        url: '/client/getReceptionHour',
        method: 'POST',
        params: credentials
      });
      return receptionHour;
    },

  };
}]);
