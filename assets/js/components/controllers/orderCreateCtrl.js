  var fournee = angular.module('fournee');
  fournee.controller('orderCreateCtrl', ['$scope', '$log', '$state', '$ngConfirm', 'ClientSvc', function($scope, $log, $state, $ngConfirm, ClientSvc) {
    // Timepicker para el rango de hora sugerida
    $scope.order = {};
    $scope.order.timeInitial = new Date();
    $scope.order.timeInitial.setHours(12);
    $scope.order.timeInitial.setMinutes(0);
    $scope.order.timeFinal = $scope.order.timeInitial;

    $scope.order.hstep = 1;
    $scope.order.mstep = 10;
    $scope.order.minTimeFinal = $scope.order.timeInitial;
    $scope.order.minTimeInitial = new Date();
    $scope.order.minTimeInitial.setHours(9);
    $scope.order.minTimeInitial.setMinutes(0);
    $scope.order.maxTimeInitial = new Date();
    $scope.order.maxTimeInitial.setHours(18);
    $scope.order.maxTimeInitial.setMinutes(0);
    $scope.order.maxTimeFinal = $scope.order.maxTimeInitial;

    // Variables para el control de la lista de productos.
    $scope.orderList = [];

    // Dropdown para listar los empleados del cliente
    ClientSvc.getClientEmployees()
      .then(function(res) {
        $scope.placement = {
          options: res.data,
          selected: res.data[0],
        };
      });

    ClientSvc.getProductsClient()
      .then(function(res) {
        $scope.products = res.data;
      })
      .catch(function(err) {
        $log.error('Server error on get products.');
      });

    // Function to make a order.
    $scope.makeOrder = function() {
      var productsToOrder = [];
      var product = null;
      var tmpDeliveryDate = null;
      var tmpClientEmployee = null;
      var tmpInitialTime = null;
      var tmpFinalTime = null;
      var tmpInformation = null;

      $scope.orderList.forEach(function(product) {
        product = {
          client_product: product.client_product,
          amount: product.amount,
          baked: product.baked,
        }
        productsToOrder.push(product);
      });

      tmpDeliveryDate = $scope.order.dt.getFullYear() + '-' + $scope.order.dt.getMonth() + '-' + $scope.order.dt.getDate();
      tmpClientEmployee = $scope.placement.selected.id;

      if ($scope.order.timeInitial.getMinutes() <= 9) {
        tmpInitialTime = $scope.order.timeInitial.getHours() + ':0' + $scope.order.timeInitial.getMinutes();
      } else {
        tmpInitialTime = $scope.order.timeInitial.getHours() + ':' + $scope.order.timeInitial.getMinutes();
      }

      if ($scope.order.timeFinal.getMinutes() <= 9) {
        tmpFinalTime = $scope.order.timeFinal.getHours() + ':0' + $scope.order.timeFinal.getMinutes();
      } else {
        tmpFinalTime = $scope.order.timeFinal.getHours() + ':' + $scope.order.timeFinal.getMinutes();
      }

      tmpInformation = $scope.order.additionalInformation;

      var orderCredentials = {
        deliveryDate: tmpDeliveryDate,
        clientEmployee: tmpClientEmployee,
        initialSuggestedTime: tmpInitialTime,
        finalSuggestedTime: tmpFinalTime,
        additionalInformation: tmpInformation,
        productsToOrder: productsToOrder
      }
      ClientSvc.makeOrder(orderCredentials)
        .then(function(res) {
          $ngConfirm({
            title: 'Pedido realizado.',
            content: 'El pedido ha sido realizado con exito.',
            type: 'green',
            buttons: {
              new: {
                text: 'Nuevo pedido',
                btnClass: 'btn-sienna',
                action: function(scope, buttons) {
                  $scope.reset();
                  $state.go('order.create.shoppingCart');
                }
              },
              exit: {
                text: 'Salir',
                btnClass: 'btn-sienna',
                action: function(scope, buttons) {
                  $state.go('order.myList');
                }
              }
            }
          });
          $log.info(res.data);
        })
        .catch(function(err) {
          $ngConfirm('El pedido no ha sido creado, verifique la fecha de entrega.');
          $log.error(err);
        });
    }

    // Function to validate products selected to make an order.
    $scope.validateProducts = function() {
      if ($scope.orderList.length == 0) {
        return;
      }
      $state.go('order.create.info');
    }

    // Function to delete a product from the order list.
    $scope.deselectProduct = function(product) {
      var index = $scope.orderList.indexOf(product);
      $scope.orderList.splice(index, 1);
      product.amount = 0;
    }

    // Function to reset product creation values.
    $scope.reset = function() {
      $scope.products.forEach(function(product, index, products) {
        product.control.reset();
      });
      $scope.orderList = [];
      $scope.order.timeInitial = new Date();
      $scope.order.timeInitial.setHours(12);
      $scope.order.timeInitial.setMinutes(0);
      $scope.order.timeFinal = $scope.order.timeInitial;
      $scope.today();
      $scope.$apply();
    }

    $scope.changedInitial = function() {
      // $log.log('Time changed to: ' + $scope.timeInitial);
      $scope.order.timeFinal = $scope.order.timeInitial;
      $scope.order.minTimeFinal = $scope.order.timeInitial;
    };

    $scope.changedFinal = function() {
      // $log.log('Time changed to: ' + $scope.timeFinal);
    };

    // Datepicker para la fecha de entrega
    $scope.today = function() {
      $scope.order.dt = new Date();
    };
    $scope.today();

    $scope.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    $scope.dateOptions = {
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
      $scope.order.dt = new Date(year, month, day);
    };

    $scope.popup1 = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [{
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

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
  }]);
