(function () {
  var fournee = angular.module('fournee');
  fournee.controller('ClientListCtrl',
    ['$scope', '$log', '$state', 'ClientSvc', clientListCtrl]);

  function clientListCtrl($scope, $log, $state, ClientSvc) {
    ClientSvc.getClients()
      .then(function (res) {
        $scope.clients = res.data;
      });

      $scope.showDetails = function (client) {
        $state.go('client.details', {client: client});
      }
  }
}())
