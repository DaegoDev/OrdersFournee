'use stric';
var fournee = angular.module('fournee',
['ui.router', 'permission', 'permission.ui', 'ngMessages', 'ngPassword',
  'ngAnimate', 'ui.bootstrap', 'ngCookies', 'cp.ngConfirm', '720kb.tooltips']);

// Inicializacion de la configuracion principal al ingresar al dominio.
fournee.run(['$rootScope', 'StorageService', 'PermRoleStore',
  function($rootScope, StorageService, PermRoleStore) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      if (!fromState.name) {
        if (StorageService.get("auth_token", "session")) {
          role = StorageService.get("role", "session");
          if (role) {
            PermRoleStore.defineRole(role.toUpperCase(), function() {
              return true;
            });
            PermRoleStore.defineRole("ANON", function() {
              return false;
            });
            $rootScope.$broadcast('renovateRole');
          }
        } else {
          PermRoleStore.clearStore();
          PermRoleStore.defineRole("ANON", function() {
            return true;
          });
          $rootScope.$broadcast('renovateRole');
        }
      }
    });
  }
]);

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

fournee.filter('bakedFilter', function() {
  return function(input) {
    if (input) {
      return 'Horneado';
    }
    return 'Congelado';
  }
});
