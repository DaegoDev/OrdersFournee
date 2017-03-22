(function() {
  var fournee = angular.module('fournee');

  fournee.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'templates/public/home.html',
          controller: 'homeCtrl'
        });

    ]})
}());
