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

        // Client creation routes.
        .state('client', {
          url: '/client/create',
          templateUrl: 'templates/private/admin/client-create.html',
          controller: 'clientCreateCtrl'
        })
        .state('client.list', {
          url: '/client/create',
          templateUrl: 'templates/private/admin/client-list.html',
        })
        .state('client.create', {
          url: '/client/create',
          templateUrl: 'templates/private/admin/client-list.html',
        })
        .state('client.create.user', {
          url: '/user',
          templateUrl: 'templates/private/admin/client-create-user.html'
        })
        .state('client.create.info', {
          url: '/info',
          templateUrl: 'templates/private/admin/client-create-info.html'
        })
        .state('client.create.products', {
          url: '/products',
          templateUrl: 'templates/private/admin/client-create-products.html'
        })

        // Product routes.
        .state('product', {
          url: '/product',
          templateUrl: 'templates/private/shared/product.html'
        })
        .state('product.list', {
          url: '/list',
          templateUrl: 'templates/private/shared/product-list.html',
          controller: 'productListCtrl'
        })
        .state('product.create', {
          url: '/create',
          templateUrl: 'templates/private/shared/product-create.html',
          controller: 'productCreateCtrl'
        });


    }]);
}());
