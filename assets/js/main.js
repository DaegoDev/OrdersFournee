'use stric';
var fournee = angular.module('fournee', ['ui.router', 'permission', 'permission.ui', 'ngMessages', 'ngPassword',
  'ngAnimate', 'ui.bootstrap', 'ngCookies', 'cp.ngConfirm', '720kb.tooltips', 'summernote', 'ngSanitize', 'AngularPrint',
  'bcherny/formatAsCurrency', 'toastr', 'ui.bootstrap.datetimepicker', 'angularjs-dropdown-multiselect'
]);

// Inicializacion de la configuracion principal al ingresar al dominio.
fournee.run(['$rootScope', 'StorageService', 'PermRoleStore',
  function($rootScope, StorageService, PermRoleStore) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      if (!fromState.name) {
        if (StorageService.get("auth_token", "session")) {
          role = StorageService.get("role", "session");
          if (role) {
            PermRoleStore.defineRole('ANON', function() {
              return false;
            });
            PermRoleStore.defineRole('ADMINISTRADOR', function() {
              return false;
            });
            PermRoleStore.defineRole('DESPACHADOR', function() {
              return false;
            });
            PermRoleStore.defineRole('CLIENTE', function() {
              return false;
            });
            PermRoleStore.defineRole(role.toUpperCase(), function() {
              return true;
            });
            $rootScope.$broadcast('renovateRole');
          }
        } else {
          PermRoleStore.clearStore();
          PermRoleStore.defineRole('ADMINISTRADOR', function() {
            return false;
          });
          PermRoleStore.defineRole('DESPACHADOR', function() {
            return false;
          });
          PermRoleStore.defineRole('CLIENTE', function() {
            return false;
          });
          PermRoleStore.defineRole("ANON", function() {
            return true;
          });
          $rootScope.$broadcast('renovateRole');
        }
      }
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }
]);

fournee.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
  $compileProvider.commentDirectivesEnabled(false);
  $compileProvider.cssClassDirectivesEnabled(false);
}]);

// Angular filters
fournee.filter('capitalize', function() {
  return function(input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
});

fournee.filter('stateFilter', function() {
  return function(input) {
    if (input) {
      return 'Activo';
    }
    return 'Inactivo';
  }
});

fournee.filter('orderState', function() {
  return function(orders, checkList) {
    var output = [];
    angular.forEach(orders, function(order, orderKey) {
      angular.forEach(checkList, function(checkValue, checkKey) {
        if (checkValue.checked && order.state.toUpperCase().trim().includes(checkValue.value)) {
          output.push(order);
        }
      });
    });
    return output;
  }
});

fournee.filter('bakedFilter', function() {
  return function(input) {
    if (input) {
      return 'Horneado';
    }
    return 'Congelado';
  }
});

fournee.filter('pesos', function($filter) {
  return function(value) {
    return '$' + value
  }
});
