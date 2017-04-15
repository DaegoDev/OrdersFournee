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

        /**
        * RUTAS DE ACCESO DE UN ADMIN.
        */
        .state("admin", {
          url: "/admin",
          templateUrl: "templates/private/admin/index.html",
          controller: "AdminController",
          data: {
            permissions: {
              only: "ADMIN",
              except: "ANON",
              redirectTo: 'home'
            }
          }
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
        .state('client.details', {
          url: '/details',
          templateUrl: 'templates/private/admin/client-details.html',
          controller: 'ClientDetailsCtrl',
          params: {
            client: null
          }
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

        // Employee routes
        .state('employee',{
          url: '/employee',
          templateUrl: 'templates/private/admin/employee.html'
        })
        .state('employee.create', {
          url: '/create',
          templateUrl: 'templates/private/admin/employee-create.html',
          controller: 'EmployeeCreateCtrl'
        })
        .state('employee.list', {
          url: '/list',
          templateUrl: 'templates/private/admin/employee-list.html',
          controller: 'EmployeeListCtrl'
        })


        /**
        * RUTAS DE ACCESO DE UN CLIENTE.
        */
        .state("clientRole", {
          url: "/clientR",
          templateUrl: "templates/private/client/index.html",
          controller: "ClientController",
          data: {
            permissions: {
              only: "CLIENTE",
              except: "ANON",
              redirectTo: 'home'
            }
          }
        })
        // Order routes.
        .state('order', {
          url: '/order',
          templateUrl: 'templates/private/client/order.html',
          controller: 'OrderCtrl'
        })
        .state('order.myList', {
          url: '/list',
          templateUrl: 'templates/private/client/order-my-list.html'
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

        // Perfil routes
        .state('clientProfile', {
          url: '/clientProfile',
          templateUrl: 'templates/private/client/client-profile.html',
          controller: 'ClientProfileCtrl'
        })

        /**
        * RUTAS DE ACCESO DE UN EMPLEADO.
        */

        // Perfil routes
        .state('employeeProfile', {
          url: '/employeeProfile',
          templateUrl: 'templates/private/employee/employee-profile.html',
          controller: 'EmployeeProfileCtrl'
        })
    }]);
}());
