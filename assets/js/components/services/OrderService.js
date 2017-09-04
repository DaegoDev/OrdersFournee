angular.module('fournee')
.factory('OrderService', ['$http', '$rootScope',
function ($http, $rootScope) {
  return {
    // Servicio para crear un pedido.
    createOrder: function(credentials) {
      var create = $http({
        url: '/order/create',
        method: 'POST',
        data: credentials
      });
      return create;
    },
    // Servicio para obtener los pedidos dado una fecha de entrega
    getOrdersByDeliveryDate: function(deliveryDate) {
      var orders = $http({
				url: '/order/getByDeliveryDate',
				method: 'GET',
				params: deliveryDate
			});
			return orders;
    },
    // Servicio para cambiar la fecha de entrega de un pedido
    changeDeliveryDate: function(credentials) {
      var change = $http({
        url: '/order/updateDeliveryDate',
        method: 'PUT',
        data: credentials
      });
      return change;
    },
    // Servicio para cambiar el estado de un pedido
    changeState: function(credentials) {
      var change = $http({
        url: '/order/changeState',
        method: 'PUT',
        data: credentials
      });
      return change;
    },
    // Servicio para cancelar un pedido
    cancelOrder: function(credentials) {
      var cancel = $http({
        url: '/order/cancelOrder',
        method: 'PUT',
        data: credentials
      });
      return cancel;
    },
    // Servicio para obtener los pedidos de un cliente
    getOrdersByClient: function () {
      var getByClient = $http({
        url: '/order/getByClient',
        method: 'GET'
      });
      return getByClient;
    },
    // Servicio para obtener la cantidad total de productos para un dia especifico.
    getProductionAfterDate: function (credentials) {
      var products = $http({
        url: '/order/getProductionAfterDate',
        method: 'GET',
        params: credentials
      });
      return products;
    },
    // Servicio para obtener los productos seleccionados para un pedido.
    getProductsSelected: function (params) {
      var products = $http({
        url: '/order/getProductsSelected',
        method: 'GET',
        params: params
      });
      return products;
    },
    // Servicio para validar que puede editar un pedido.
    validateDateToUpdate: function (params) {
      var isCorrect = $http({
        url: '/order/validateDateToUpdate',
        method: 'GET',
        params: params
      });
      return isCorrect;
    },
    // Servicio para validar que puede editar un pedido.
    validateStateToCancel: function (params) {
      var isCorrect = $http({
        url: '/order/validateStateToCancel',
        method: 'GET',
        params: params
      });
      return isCorrect;
    },
    // Servicio para definir el pedido como facturado.
    setInvoiced: function (params) {
      var order = $http({
        url: '/order/setInvoiced',
        method: 'PUT',
        data: params
      });
      return order;
    }
  };
}]);
