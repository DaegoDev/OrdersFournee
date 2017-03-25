(function(){
  var fournee = angular.module('fournee');

  fournee.directive('sidebar', function () {
    return {
      restric: 'E',
      transclude: true,
      templateUrl: 'templates/public/sidebar.html',
      scope: {toggle: '='},
      controller: 'sidebarCtrl'
    }
  })

  fournee.controller('sidebarCtrl', ['$scope', '$cookieStore', '$log', sidebarCtrl]);
  function sidebarCtrl($scope, $cookieStore, $log) {
      var viewport = 992;
      $scope.toggle = false;

      $scope.$watch($scope.getWidth, function (newValue, oldValue) {
        if (angular.isDefined($cookieStore.get('toggle'))) {
          $scope.toggle = !$cookieStore.get('toggle') ? false : true;
        } else {
          $scope.toggle = true;
        }
      });
      $scope.toggleSidebar = function () {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
      }

      window.onresize = function () {
        $scope.$apply();
      }
  }
}())
