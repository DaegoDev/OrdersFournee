(function() {
  var fournee = angular.module('fournee');

  fournee.directive('sidebar', function() {
    return {
      restric: 'E',
      transclude: true,
      templateUrl: 'templates/public/sidebar.html',
      scope: {
        toggle: '='
      },
      controller: 'sidebarCtrl'
    }
  })

  fournee.controller('sidebarCtrl', ['$scope', '$cookieStore', '$log', 'AuthService', sidebarCtrl]);

  function sidebarCtrl($scope, $cookieStore, $log, AuthService) {
    var viewport = 992;
    $scope.toggle = false;

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
      if (angular.isDefined($cookieStore.get('toggle'))) {
        $scope.toggle = !$cookieStore.get('toggle') ? false : true;
      } else {
        $scope.toggle = true;
      }
    });
    $scope.toggleSidebar = function() {
      $scope.toggle = !$scope.toggle;
      $cookieStore.put('toggle', $scope.toggle);
    }
    this.toggleSidebar = $scope.toggleSidebar;

    window.onresize = function() {
      $scope.$apply();
    }

    $scope.role = AuthService.getRole();

    $scope.$on('renovateRole', function(evt) {
      $scope.role = AuthService.getRole();
    });

    $scope.isClient = function() {
      return $scope.role === "CLIENTE";
    };

    $scope.isAdmin = function() {
      return $scope.role === "ADMIN";
    };

    $scope.isEmployee = function() {
      if($scope.role === "DESPACHADOR" || $scope.role === "ADMIN"){
        return true;
      }else {
        return false;
      }
    };

    $scope.isDespachador = function() {
      return $scope.role === "DESPACHADOR";
    };
  }
}())
