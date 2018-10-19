var fournee = angular.module('fournee');

  fournee.factory('productItemSvc', ['$http', '$log',
    function($http, $log) {
      return {
        createItem: function (newItem) {
          var item = $http({
            url: '/item/createItem',
            method: 'POST',
            data: newItem
          });
          return item;
        },
        createElement: function (newElement) {
          var element = $http({
            url: '/item/createElement',
            method: 'POST',
            data: newElement
          });
          return element;
        },
        deleteElement: function (elementId) {
          var element = $http({
            url: '/item/deleteElement',
            method: 'DELETE',
            data: elementId
          });
          return element;
        },
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
        getProductPriority: function () {
          var priorities = $http({
            url: '/item/getProductPriority',
            method: 'GET'
          });
          return priorities;
        },
        getAll: function() {
          var items = $http({
            url: '/item/getAll',
            method: 'GET',
          });
          return items;
        },
        disableItem: function (itemId) {
          var item = $http({
            url: '/item/disableItem',
            method: 'PUT',
            data: itemId
          });
          return item;
        }
      }
    }
  ]);
