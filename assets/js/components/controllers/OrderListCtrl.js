var fournee = angular.module('fournee');
fournee.controller('OrderListCtrl', ['$scope', '$log', 'OrderService', '$ngConfirm', 'AuthService', function($scope, $log, OrderService, $ngConfirm, AuthService) {
  $scope.sortByProperty = 'id';
  $scope.checkList = [{
      text: "Confirmado",
      value: "CONFIRMADO",
      checked: true
    },
    {
      text: "Pendiente",
      value: "PENDIENTE",
      checked: true
    },
    {
      text: "Alistado",
      value: "ALISTADO",
      checked: true
    },
    {
      text: "Despachado",
      value: "DESPACHADO",
      checked: true
    }
  ];

  // Obtiene el role del usuario.
  $scope.role = AuthService.getRole();

  // Verifica que el usuario sea un administrador.
  $scope.isAdmin = function() {
    return $scope.role === "ADMINISTRADOR";
  };

  // Verifica que el usuario sea un despachador.
  $scope.isDespachador = function() {
    return $scope.role === "DESPACHADOR";
  };

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
    options: [
      'Pendiente de confirmación',
      'Confirmado',
      'Alistado',
      'Despachado',
      'Cancelado'
    ],
    selected: 'Confirmado',
  };

  $scope.getOrdersByDeliveryDate = function() {
    var deliveryDate = $scope.dt.getTime() + (-(new Date().getTimezoneOffset() * 60 * 1000));
    OrderService.getOrdersByDeliveryDate({
        deliveryDate: deliveryDate
      })
      .then(function(res) {
        $scope.orders = res.data;
        $scope.setCheckboxObj();
      })
      .catch(function(err) {
        $log.debug('Error getting orders');
      })
  }

  $scope.setCheckboxObj = function() {
    // Objeto que contiene los checkbox
    $scope.checkboxObj = {};
    angular.forEach($scope.orders, function(order, key) {
      $scope.checkboxObj[order.id] = false;
    })
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
    $scope.all = !$scope.all;
    angular.forEach($scope.checkboxObj, function(checkbox, index) {
      if ($scope.all && !checkbox) {
        $scope.checkboxObj[index] = !checkbox;
      } else if (!$scope.all && checkbox) {
        $scope.checkboxObj[index] = !checkbox;
      }
    })
  }

  $scope.uncheckAllOrders = function() {
    $scope.all = !$scope.all;
    angular.forEach($scope.checkboxObj, function(checkbox, index) {
      $scope.checkboxObj[index] = false;
      $scope.all = false;
    })
  }

  $scope.checkSelectAll = function(order) {
    var isCheckedAll = true;
    angular.forEach($scope.checkboxObj, function(checkbox, index) {
      if (isCheckedAll) {
        if (!checkbox) {
          isCheckedAll = false;
        }
      }
    })
    if (isCheckedAll) {
      $scope.all = true;
    } else {
      $scope.all = false;
    }
  }

  $scope.changeState = function() {
    var checkedOrders = getCheckedOrders();
    if (checkedOrders.length == 0) {
      $ngConfirm('Debe seleccionar una orden.');
      return;
    }
    var credentials = {
      orderIds: checkedOrders,
      newState: $scope.placement.selected,
    }
    OrderService.changeState(credentials)
      .then(function(res) {
        var updatedOrders = res.data;
        angular.forEach(updatedOrders, function(order, index) {
          updateField("state", order.id, order.state);
        })
        $scope.all = false;
        $scope.setCheckboxObj();
      })
  }

  function updateField(field, orderId, value) {
    angular.forEach($scope.orders, function(order, index) {
      if (order.id === orderId) {
        order[field] = value;
        return;
      }
    })
  }

  $scope.showConfirmation = function() {
    var checkedOrders = getCheckedOrders();
    if (checkedOrders.length == 0) {
      $ngConfirm('Debe seleccionar una orden.');
      return;
    }
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
            $scope.uncheckAllOrders();
          }
        },
        close: function() {
          $scope.today2();
        }
      }
    });
  }

  function removeOrder(orderId) {
    angular.forEach($scope.orders, function(order, index) {
      if (order.id === orderId) {
        $scope.orders.splice(index, 1);
        return;
      }
    })
  }

  function changeDeliveryDate() {
    var checkedOrders = getCheckedOrders();
    var newDeliveryDate = $scope.dt2.getTime() + (-(new Date().getTimezoneOffset() * 60 * 1000));
    var credentials = {
      orderIds: checkedOrders,
      deliveryDate: newDeliveryDate,
    }
    OrderService.changeDeliveryDate(credentials)
      .then(function(res) {
        var updatedOrders = res.data;
        angular.forEach(updatedOrders, function(order, index) {
          removeOrder(order.id);
        })
        $scope.all = false;
      })
  }

  $scope.showDetails = function(order) {
    $scope.orderDetails = order;
    $ngConfirm({
      title: 'Detalles del pedido',
      useBootstrap: false,
      contentUrl: 'templates/private/employee/order-details.html',
      scope: $scope,
      theme: 'light',
      columnClass: 'medium'
    })
  }

  $scope.setInvoiced = function(order) {
    OrderService.setInvoiced({
        orderId: order.id,
        invoicedValue: order.invoiced
      })
      .then((res) => {
        console.log(res.data);
        // order.invoiced = res.data.invoiced;
      })
      .catch((err) => {
        console.log(err);
      })
  }

  $scope.sortBy = function(name) {
    $scope.sortByProperty = name;
    $scope.sortReversed = ($scope.sortByProperty === name) ? !$scope.sortReversed : false;
  }
}]);
