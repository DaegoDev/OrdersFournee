var fournee = angular.module('fournee');
fournee.controller('OrderMyListCtrl', ['$scope', '$log', '$state', 'OrderService', '$ngConfirm', function($scope, $log, $state, OrderService, $ngConfirm) {

  OrderService.getOrdersByClient()
    .then(function(res) {
      $scope.orders = res.data;
      // $log.info(res);
    })
    .catch(function(err) {
      $log.error('It has no been posible to get all orders.')
    });

  $scope.showEditForm = function(order) {
    OrderService.validateDateToUpdate({
        orderId: order.id
      })
      .then(function(res) {
        console.log("hora correcta");
        $state.go('order.create.shoppingCartUpdate', {
          order: order
        });
      })
      .catch(function(err) {
        $ngConfirm("No se puede editar el pedido después de las 2pm del mismo día en que lo creó.")
      })
  }

  $scope.cancelOrderConfirm = function(order) {
    OrderService.validateDateToUpdate({
        orderId: order.id
      })
      .then(function(res) {
        console.log("hora correcta");
        $ngConfirm({
          title: '¿Realmente desea cancelar el pedido?',
          useBootstrap: true,
          content: 'Este dialogo eligirá la opción cancelar automaticamente en 6 segundo si no responde.',
          autoClose: 'cancel|8000',
          buttons: {
            cancelOrder: {
              text: 'Cancelar pedido',
              btnClass: 'btn-red',
              action: function() {
                $scope.cancelOrder(order);
              }
            },
            cancel: function() {
              $ngConfirm('La acción ha sido cancelada');
            }
          }
        });
      })
      .catch(function(err) {
        $ngConfirm("No se puede cancelar el pedido después de las 2pm del mismo día en que lo creó.")
      })
  }

  $scope.cancelOrder = function(order) {
    OrderService.cancelOrder({
        orderId: order.id
      })
      .then(function(res) {
        console.log(res.data);
        order.state = res.data.state;
      })
      .catch(function(err) {
        $ngConfirm("No se puedo cancelar el pedido");
      })
  }

}]);
