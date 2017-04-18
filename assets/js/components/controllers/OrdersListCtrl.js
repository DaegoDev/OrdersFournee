(function() {
  var fournee = angular.module('fournee');
  fournee.controller('OrdersListCtrl', ['$scope', '$log', 'OrderService', '$ngConfirm', ordersListCtrl]);

  function ordersListCtrl($scope, $log, OrderService, $ngConfirm) {
    // Datepicker para la fecha de entrega
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    // $scope.inlineOptions = {
    //   customClass: getDayClass,
    //   minDate: new Date(),
    //   showWeeks: true
    // };

    $scope.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      // minDate: new Date(),
      startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0);
    }

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.setDate = function(year, month, day) {
      $scope.dt = new Date(year, month, day);
    };

    $scope.popup1 = {
      opened: false
    };

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }
      return '';
    }

    // Dropdown para listar los estados de un pedido;
    $scope.placement = {
      options: ['Confirmado',
        'Pendiente de confirmación',
        'Alistado',
        'Despachado'
      ],
      selected: 'Confirmado',
    };

    $scope.getOrdersByDeliveryDate = function() {
      var deliveryDate = ($scope.dt.getYear() + 1900) + "-" + $scope.dt.getMonth() + "-" + $scope.dt.getDate();
      OrderService.getOrdersByDeliveryDate({
          deliveryDate: deliveryDate
        })
        .then(function(res) {
          $scope.orders = res.data;
          $scope.setCheckboxObj();
        })
        .catch(function(err) {

        })
    }

    $scope.setCheckboxObj = function() {
      // Objeto que contiene los checkbox
      $scope.checkboxObj = {};
      angular.forEach($scope.orders, function(order, key) {
        $scope.checkboxObj[order.id] = false;
      })
      console.log($scope.checkboxObj);
    }

    // Obtiene todas los pedidos con una fecha de entrega
    $scope.getOrdersByDeliveryDate();

    // Obtiene los checkbox checkeados.
    function getCheckedOrders() {
      var checkedOrders = [];
      angular.forEach($scope.checkboxObj, function(cb, key) {
        if (cb) {
          checkedOrders.push(key)
        }
      });
      return checkedOrders;
    }

    $scope.changeState = function() {
      var checkedOrders = getCheckedOrders();
      if(checkedOrders.length == 0){
        $ngConfirm('Debe seleccionar una orden.');
        return;
      }
      console.log(checkedOrders);
      var credentials = {
        orderIds: checkedOrders,
        newState: $scope.placement.selected,
      }
      // console.log(credentials.orderIds);
      // console.log(credentials.newState);
      OrderService.changeState(credentials)
      .then(function (res) {
        // console.log(res.data);
        var updatedOrders = res.data;
        angular.forEach(updatedOrders, function(order, index) {
          $scope.orders[order.id].state = order.state;
        })
      })
    }

    $scope.openFormDeliveryDate = function() {
      $scope.newDeliveryDate = null;
      $ngConfirm({
        title: 'Nueva fecha de entrega',
        contentUrl: 'templates/private/employee/order-details.html',
        scope: $scope,
        theme: 'light',
        columnClass: 'medium'
      })
    }

    $scope.changeDeliveryDate = function () {
      var checkedOrders = getCheckedOrders();
      if(checkedOrders.length == 0){
        $ngConfirm('Debe seleccionar una orden.');
        return;
      }
      console.log(checkedOrders);
      var credentials = {
        orderIds: checkedOrders,
        newState: $scope.placement.selected,
      }
      // console.log(credentials.orderIds);
      // console.log(credentials.newState);
      OrderService.changeState(credentials)
      .then(function (res) {
        // console.log(res.data);
        var updatedOrders = res.data;
        angular.forEach(updatedOrders, function(order, index) {
          $scope.orders[order.id].state = order.state;
        })
      })
    }



    $scope.showDetails = function(order) {
      $scope.orderId = order;
      var orderId = order.toString();
      $scope.orderDetails = $scope.orders[orderId];
      $ngConfirm({
        title: 'Detalles del pedido',
        contentUrl: 'templates/private/employee/order-details.html',
        scope: $scope,
        theme: 'light',
        columnClass: 'medium'
      })
    }

  }
}())
