(function(){
  var fournee = angular.module('fournee');

  fournee.directive('loginForm', function () {
    return {
      restric: 'E',
      require: '^sidebar',
      templateUrl: 'templates/public/login.html',
      controller: 'loginCtrl',
      link: function (scope,element,attrs,parentCtrl) {
        scope.toggleSidebar = parentCtrl.toggleSidebar;
      }
    }
  })

  fournee.controller('loginCtrl', ['$scope', '$cookieStore', '$log', loginCtrl]);
  function loginCtrl($scope, $cookieStore, $log) {
    $scope.focus = function () {
      $scope.toggleSidebar();
      console.log(document.getElementById('testlog'))
      document.getElementById('testlog').focus();
    }
  }
}())
