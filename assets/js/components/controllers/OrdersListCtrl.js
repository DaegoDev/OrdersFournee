
  var fournee = angular.module('fournee');
  fournee.controller('OrdersListCtrl', ['$scope', '$log', 'OrderService', '$ngConfirm', function($scope, $log, OrderService, $ngConfirm) {
    // Datepicker para la fecha de entrega
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      // minDate: new Date(),
      startingDay: 1
    };
    $scope.optionsDeliveryDate = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
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

    // Datepicker para cambiar la fecha de entrega
    $scope.today2 = function() {
      $scope.dt2 = new Date();
    };
    $scope.today2();

    $scope.open2 = function() {
      var checkedOrders = getCheckedOrders();
      if (checkedOrders.length == 0) {
        $ngConfirm('Debe seleccionar una orden.');
        return;
      }
      $scope.popup2.opened = true;
    };

    $scope.popup2 = {
      opened: false
    };

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
      // console.log($scope.checkboxObj);
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

    $scope.checkAllOrders = function() {
      // console.log($scope.all);
      angular.forEach($scope.checkboxObj, function(checkbox, index) {
        if ($scope.all && !checkbox) {
          $scope.checkboxObj[index] = !checkbox;
        } else if (!$scope.all && checkbox) {
          $scope.checkboxObj[index] = !checkbox;
        }
      })
      // console.log($scope.checkboxObj);
    }

    $scope.checkSelectAll = function(order) {
      var isCheckedAll = true
      angular.forEach($scope.checkboxObj, function(checkbox, index) {
        if (isCheckedAll) {
          if (!checkbox) {
            isCheckedAll = false;
          }
        }
      })
      if (isCheckedAll) {
        $scope.all = true;
      }
      // else if (!$scope.checkboxObj[order]) {
      //   $scope.all = false;
      // }
      // console.log($scope.checkboxObj);
    }

    $scope.changeState = function() {
      var checkedOrders = getCheckedOrders();
      if (checkedOrders.length == 0) {
        $ngConfirm('Debe seleccionar una orden.');
        return;
      }
      // console.log(checkedOrders);
      var credentials = {
        orderIds: checkedOrders,
        newState: $scope.placement.selected,
      }
      OrderService.changeState(credentials)
        .then(function(res) {
          // console.log(res.data);
          var updatedOrders = res.data;
          angular.forEach(updatedOrders, function(order, index) {
            $scope.orders[order.id].state = order.state;
          })
          $scope.all=false;
          $scope.setCheckboxObj();
        })
    }

    $scope.showConfirmation = function() {
      $scope.ordersConfirmed = getCheckedOrders();
      $ngConfirm({
        title: 'Cambio de fecha de entrega',
        contentUrl: 'templates/private/employee/confirm-change-deliveryDate.html',
        scope: $scope,
        theme: 'light',
        columnClass: 'medium',
        buttons: {
          confirmButton: {
            text: 'Confirmar',
            btnClass: 'btn-green',
            action: function() {
              changeDeliveryDate();
            }
          },
          close: function() {
            $scope.today2();
          }
        }
      });

    }

    function changeDeliveryDate() {
      var checkedOrders = getCheckedOrders();
      var newDeliveryDate = ($scope.dt2.getYear() + 1900) + "-" + $scope.dt2.getMonth() + "-" + $scope.dt2.getDate();
      // console.log(checkedOrders);
      var credentials = {
        orderIds: checkedOrders,
        deliveryDate: newDeliveryDate,
      }
      // console.log(credentials.orderIds);
      OrderService.changeDeliveryDate(credentials)
        .then(function(res) {
          // console.log(res.data);
          var updatedOrders = res.data;
          angular.forEach(updatedOrders, function(order, index) {
            delete $scope.orders[order.id];
          })
          $scope.all=false;
        })
    }

    $scope.showDetails = function(order) {
      $scope.orderId = order;
      var orderId = order.toString();
      $scope.orderDetails = $scope.orders[orderId];
      // console.log($scope.orderDetails);
      $ngConfirm({
        title: 'Detalles del pedido',
        contentUrl: 'templates/private/employee/order-details.html',
        scope: $scope,
        theme: 'light',
        columnClass: 'medium'
      })
    }

  }]);
