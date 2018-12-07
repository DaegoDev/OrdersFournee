angular.module('fournee')
.factory('ProductionConfigSvc', ['$http', '$rootScope',
function ($http, $rootScope) {
  return {
    // Service to get the production config.
    getProductionConfig: function() {
      var productionConfig = $http({
        url: '/productionConfig/get',
        method: 'GET',
      });
      return productionConfig;
    },
    // Service to create the item config.
    createConfigItem: function(params) {
      var itemCreated = $http({
        url: '/itemConfig/create',
        method: 'POST',
        data: params
      });
      return itemCreated;
    },
    // Service to update the item config.
    updateConfigItem: function(params) {
      var itemUpdated = $http({
        url: '/itemConfig/update',
        method: 'PUT',
        data: params
      });
      return itemUpdated;
    },
    // Service to get the production report
    getProductionReport: function(params) {
      var productionReport = $http({
        url: '/productionReport/get',
        method: 'GET',
        params: params
      });
      return productionReport;
    }
  };
}]);