(function() {
  var fournee = angular.module('fournee');

  fournee.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'templates/public/home.html'
        })
        .state('client-create', {
          url: '/client/create',
          templateUrl: 'templates/private/admin/client-create.html',
          controller: 'clientCreateCtrl'
        })
        .state('client-create.user', {
          url: '/user',
          templateUrl: 'templates/private/admin/client-create-user.html'
        })
        .state('client-create.info', {
          url: '/info',
          templateUrl: 'templates/private/admin/client-create-info.html'
        })
        .state('client-create.products', {
          url: '/products',
          templateUrl: 'templates/private/admin/client-create-products.html'
        });

    }]);
}());
