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

  };
}]);
