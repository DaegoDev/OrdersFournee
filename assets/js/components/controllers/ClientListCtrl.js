var fournee = angular.module('fournee');
  fournee.controller('ClientListCtrl',
    ['$scope', '$log', '$state', 'ClientSvc', function($scope, $log, $state, ClientSvc) {
    $scope.orderbyProperty = 'state';
    ClientSvc.getClients()
      .then(function (res) {
        $scope.clients = res.data;
      })
      .catch(function (err) {
        $log.error('It has no been posible to get all clients.')
      });

      $scope.showDetails = function (client) {
        $state.go('client.details', {client: client});
      }

      $scope.sortBy = function (name) {
        $scope.sortByProperty = name;
        $scope.sortReversed = ($scope.sortByProperty === name) ? !$scope.sortReversed : false;
      }
  }]);
