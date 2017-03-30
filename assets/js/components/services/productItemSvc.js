(function() {
  var fournee = angular.module('fournee');

  fournee.factory('productItemSvc', ['$http', '$log',
    function($http, $log) {
      return {
        getByName: function(nameStr) {
          var item = $http({
            url: '/item/getByName',
            method: 'GET',
            params: {
              name: nameStr
            }
          });
          return item;
        },
        getAll: function() {
          var items = $http({
            url: '/item/getAll',
            method: 'GET',
          });
          return items;
        }
      }
    }
  ]);
}())
