(function () {
  var fournee = angular.module('fournee');

  fournee.controller('AnnouncementPreviewCtrl', ['$scope', '$log', '$stateParams', '$state', '$sce', 'AnnouncementSvc',
  function ($scope, $log, $stateParams, $state, $sce, AnnouncementSvc) {

    if ($stateParams.announcement) {
      $scope.announcement = $stateParams.announcement;
    } else {
      $state.go('announcement.create');
    }

    $scope.back = function () {
      $state.go('announcement.create', $stateParams);
    }

    $scope.sanitize = function (htmlContent) {
      return $sce.trustAsHtml(htmlContent);
    }

  }]);
})();
