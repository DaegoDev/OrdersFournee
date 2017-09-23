var fournee = angular.module('fournee');
fournee.controller('ClientListCtrl', ['$scope', '$log', '$state', 'ClientSvc', 'StorageService',
  function($scope, $log, $state, ClientSvc, StorageService) {
    $scope.orderbyProperty = 'state';
    ClientSvc.getClients()
      .then(function(res) {
        $scope.clients = res.data;
      })
      .catch(function(err) {
        $log.error('It has no been posible to get all clients.')
      });

    $scope.showDetails = function(client) {
      $state.go('client.details');
      var clientToSend = JSON.stringify(client);
      StorageService.set('client', clientToSend, 'session');
    }

    $scope.sortBy = function(name) {
      $scope.sortByProperty = name;
      $scope.sortReversed = ($scope.sortByProperty === name) ? !$scope.sortReversed : false;
    }
  }
]);
