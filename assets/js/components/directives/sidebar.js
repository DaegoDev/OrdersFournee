(function(){
  var fournee = angular.module('fournee');

  fournee.directive('sidebar', function () {
    return {
      restric: 'E',
      templateUrl: 'templates/public/sidebar.html',
    }
  })
}())
