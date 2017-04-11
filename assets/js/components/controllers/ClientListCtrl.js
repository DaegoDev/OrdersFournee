(function () {
  var fournee = angular.module('fournee');
  fournee.controller('ClientListCtrl',
    ['$scope', '$log', 'ClientSvc', clientListCtrl]);

  function clientListCtrl($scope, $log, ClientSvc) {
    ClientSvc.getClients()
      .then(function (res) {
        console.log(res)
        $scope.clients = res.data;
      });
  }

}())
