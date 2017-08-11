(function () {
  var fournee = angular.module('fournee');

  fournee.factory('AnnouncementSvc', ['$http', '$log',
    function ($http, $log) {

      return {
        create: function (announcement) {
          var credentials = {
            title: announcement.title,
            content: announcement.content
          };

          return $http({
            method: 'POST',
            url: '/announcement/create',
            data: credentials
          });
        },

        update: function (announcement) {
          var credentials = {
            id: announcement.id,
            title: announcement.title,
            content: announcement.content
          };

          return $http({
            method: 'PUT',
            url: '/announcement/update',
            data: credentials
          });
        },

        delete: function (announcement) {
          var credentials = {
            id: announcement.id
          }

          return $http({
            method: 'DELETE',
            url: '/announcement/delete',
            params: credentials
          });
        },

        getAll: function () {
          return $http({
            method: 'GET',
            url: '/announcement/getAll'
          });
        }
      }
    }
  ]);
})();
