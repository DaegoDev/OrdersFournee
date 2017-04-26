var fournee = angular.module('fournee');
fournee.controller('OrderMyListCtrl', ['$scope', '$log', '$state', 'OrderService', function($scope, $log, $state, OrderService) {
  // console.log('listando...');
  OrderService.getOrdersByClient()
    .then(function(res) {
      // console.log(res.data);
      $scope.orders = res.data;
      $log.info(res);
    })
    .catch(function(err) {
      $log.error('It has no been posible to get all orders.')
    });
}]);
