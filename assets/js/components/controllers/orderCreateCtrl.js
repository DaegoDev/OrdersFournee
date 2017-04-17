(function() {
  var fournee = angular.module('fournee');
  fournee.controller('orderCreateCtrl', ['$scope', '$log', '$state', '$ngConfirm', 'ClientSvc', orderCreateCtrl]);

  // Timepicker para el rango de hora sugerida
  function orderCreateCtrl($scope, $log, $state, $ngConfirm, ClientSvc) {
    $scope.timeInitial = new Date();
    $scope.timeInitial.setHours(12);
    $scope.timeInitial.setMinutes(0);
    $scope.timeFinal = $scope.timeInitial;

    $scope.hstep = 1;
    $scope.mstep = 10;
    $scope.minTimeFinal = $scope.timeInitial;
    $scope.minTimeInitial = new Date();
    $scope.minTimeInitial.setHours(9);
    $scope.minTimeInitial.setMinutes(0);
    $scope.maxTimeInitial = new Date();
    $scope.maxTimeInitial.setHours(18);
    $scope.maxTimeInitial.setMinutes(0);
    $scope.maxTimeFinal = $scope.maxTimeInitial;

    // Variables para el control de la lista de productos.
    $scope.order=  {};
    $scope.orderList = [];

    ClientSvc.getProductsClient()
      .then(function(res) {
        $scope.products = res.data;
      })
      .catch(function(err) {
        $log.error('Server error on get products.');
      });

      // Function to make a order.
      $scope.makeOrder = function () {
        var productsToOrder = [];
        var product = null;
        $scope.orderList.forEach(function (product) {
          product = {
            client_product: product.client_product,
            amount: product.amount,
            baked: product.baked,
          }
          productsToOrder.push(product);
        });
        var orderCredentials = {
          dt: $scope.dt,
          deliveryDate: $scope.dt.getFullYear() + '-' + $scope.dt.getMonth() + '-' + $scope.dt.getDate(),
          clientEmployee: $scope.placement.selected.id,
          initialSuggestedTime: $scope.timeInitial.getHours() + ':' + $scope.timeInitial.getMinutes(),
          finalSuggestedTime: $scope.timeFinal.getHours()+ ':' + $scope.timeFinal.getMinutes(),
          additionalInformation: $scope.order.additionalInformation,
          productsToOrder: productsToOrder
        }
        ClientSvc.makeOrder(orderCredentials)
          .then(function (res) {
            $ngConfirm({
              title: 'Pedido',
              content: 'El pedido ha sido realizado con exito.',
              buttons: {
                new: {
                  text: 'Nuevo pedido',
                  action: function (scope, buttons) {
                    $state.go('order.create.shoppingCart')
                  }
                },
                exit: {
                  text: 'Salir',
                  action: function (scope, buttons) {
                    $state.go('order.myList');
                  }
                }
              }
            });
            $log.info(res.data);
          })
          .catch(function (err) {
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

    $scope.changedInitial = function() {
      // $log.log('Time changed to: ' + $scope.timeInitial);
      $scope.timeFinal = $scope.timeInitial;
      $scope.minTimeFinal = $scope.timeInitial;
    };

    $scope.changedFinal = function() {
      // $log.log('Time changed to: ' + $scope.timeFinal);
    };

    // Datepicker para la fecha de entrega
    $scope.today = function() {
      $scope.dt = new Date();
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
      $scope.dt = new Date(year, month, day);
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

    // Dropdown para listar los empleados del cliente
    ClientSvc.getClientEmployees()
      .then(function(res) {
        $scope.placement = {
          options: res.data,
          selected: res.data[0],
        };
      });
  }
}())
