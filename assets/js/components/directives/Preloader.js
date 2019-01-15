var fournee = angular.module('fournee');

fournee.directive('preloader', function() {
  return {
    restric: 'E',
    templateUrl: 'templates/public/preloader.html',
    controller: 'preloaderCtrl'
  }
})

fournee.controller('preloaderCtrl', ['$scope', 
  function($scope) {


  }
]);
