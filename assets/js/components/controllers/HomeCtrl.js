(function () {
  var fournee = angular.module('fournee');

  fournee.controller('HomeCtrl', ['$scope', '$log', 'AnnouncementSvc', '$sce',
  function ($scope, $log, AnnouncementSvc, $sce) {

    $scope.loadAnnouncements = function () {
      AnnouncementSvc.getAll()
      .then(function (res) {
        angular.forEach(res.data, function (announcement, index) {
          announcement.content = $sce.trustAsHtml(announcement.content);
        });
        $scope.announcements = res.data;
      })
      .catch(function (err) {
        $log.log(err);
      });
    }
    $scope.loadAnnouncements();

  }]);
})();
