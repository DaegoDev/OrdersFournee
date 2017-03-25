(function(){
  var fournee = angular.module('fournee');

  fournee.directive('loginForm', function () {
    return {
      restric: 'E',
      require: '^sidebar',
      templateUrl: 'templates/public/login.html',
      controller: 'loginCtrl'
    }
  })

  fournee.controller('loginCtrl', ['$scope', '$cookieStore', '$log', loginCtrl]);
  function loginCtrl($scope, $cookieStore, $log) {

  }
}())
