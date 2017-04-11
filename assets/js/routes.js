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
          url: '/client',
          templateUrl: 'templates/private/admin/client.html'
        })
        .state('client.list', {
          url: '/list',
          templateUrl: 'templates/private/admin/client-list.html',
          controller: 'ClientListCtrl'
        })
        .state('client.create', {
          url: '/create',
          templateUrl: 'templates/private/admin/client-create.html',
          controller: 'clientCreateCtrl'
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
        })

        /**
        * RUTAS DE ACCESO DE UN CLIENTE.
        */
        .state("clientRole", {
          url: "/client",
          templateUrl: "templates/private/client/index.html",
          controller: "ClientController",
          data: {
            permissions: {
              only: "CLIENT",
              except: "ANON",
              redirectTo: 'home'
            }
          }
        })
        // Order routes.
        .state('order', {
          url: '/order',
          templateUrl: 'templates/private/client/order.html'
        })
        .state('order.list', {
          url: '/list',
          templateUrl: 'templates/private/client/order-list.html'
        })
        .state('order.create', {
          url: '/create',
          templateUrl: 'templates/private/client/order-create.html'
        })
        .state('order.create.shoppingCart', {
          url: '/shoppingCart',
          templateUrl: 'templates/private/client/order-create-shoppingCart.html'
        })
        .state('order.create.info', {
          url: '/info',
          templateUrl: 'templates/private/client/order-create-info.html',
          controller: 'orderCreateCtrl'
        })
    }]);
}());
