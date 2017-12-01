var fournee = angular.module('fournee');
fournee.controller('OrderMyListCtrl', ['$scope', '$log', '$state', 'OrderService', '$ngConfirm', function($scope, $log, $state, OrderService, $ngConfirm) {

  OrderService.getOrdersByClient()
    .then(function(res) {
      $scope.orders = res.data;
      console.log($scope.orders);
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
        $state.go('order.create.shoppingCartUpdate', {
          order: order
        });
      })
      .catch(function(err) {
        $ngConfirm("Hay algún impedimiento de horario o estado para editar el pedido.")
      })
  }

  $scope.cancelOrderConfirm = function(order) {
    OrderService.validateStateToCancel({
        orderId: order.id
      })
      .then(function(res) {
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
        $ngConfirm("El pedido no se puede cancelar, ya ha sido despachado o cancelado")
      })
  }

  $scope.cancelOrder = function(order) {
    OrderService.cancelOrder({
        orderId: order.id
      })
      .then(function(res) {
        order.state = res.data.state;
      })
      .catch(function(err) {
        $ngConfirm("No se puedo cancelar el pedido");
      })
  }

  $scope.showDetails = function(order) {
    $scope.orderDetails = order;
    var totalPrice = 0;
    order.products.forEach((product) => {
      var subTotal = product.custom_price * product.amount;
      totalPrice += subTotal;
    })
    $scope.totalPrice = totalPrice;
    $ngConfirm({
      title: 'Detalles del pedido con código: ' + $scope.orderDetails.id.toString(),
      useBootstrap: false,
      contentUrl: 'templates/private/employee/order-details.html',
      scope: $scope,
      theme: 'light',
      columnClass: 'medium'
    })
  }

}]);
