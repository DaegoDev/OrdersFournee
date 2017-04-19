angular.module('fournee')
.factory('OrderService', ['$http', '$rootScope',
function ($http, $rootScope) {
  return {
    // Servicio para crear un pedido.
    createOrder: function(credentials) {
      var create = $http({
        url: '/order/create',
        method: 'POST',
        params: credentials
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
      console.log(credentials);
      var change = $http({
        url: '/order/updateDeliveryDate',
        method: 'PUT',
        params: credentials
      });
      return change;
    },
    // Servicio para cambiar el estado de un pedido
    changeState: function(credentials) {
      var change = $http({
        url: '/order/changeState',
        method: 'PUT',
        params: credentials
      });
      return change;
    },
    // Servicio para obtener los pedidos de un cliente
    getOrdersByClient: function () {
      var getByClient = $http({
        url: '/order/getByClient',
        method: 'GET'
      });
      return getByClient;
    }

  };
}]);
