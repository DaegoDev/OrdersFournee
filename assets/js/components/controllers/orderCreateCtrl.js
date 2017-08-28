var fournee = angular.module('fournee');
fournee.controller('OrderCreateCtrl', ['$scope', '$log', '$state', '$ngConfirm', 'ClientSvc', 'OrderService', '$stateParams', 'ProfileService',
  function($scope, $log, $state, $ngConfirm, ClientSvc, OrderService, $stateParams, ProfileService) {
    // Timepicker para el rango de hora sugerida

    // Variables para el control de la lista de productos.
    $scope.order = {};
    $scope.orderList = [];
    $scope.products = [];
    var orderParam = null;
    var tmpProductsEnabled = [];

    // Verify that the form is to update or create.
    if ($stateParams.order) {
      $scope.formToUpdate = true;
      orderParam = $stateParams.order;
      $scope.order.additionalInformation = orderParam.additionalInformation;
    }

    // Call the function to get the products enabled to the client.
    ClientSvc.getProductsClient()
      .then(function(res) {
        tmpProductsEnabled = res.data;
        if ($scope.formToUpdate) {
          return OrderService.getProductsSelected({
            orderId: orderParam.id
          });
        }
      })
      .then(function(products) {
        if (products) {
          products.data.forEach(function(productSelected, indexPs) {
            var idProductSelected = productSelected.id;
            tmpProductsEnabled.forEach(function(productEnabled, indexPe) {
              if (idProductSelected == productEnabled.id) {
                tmpProductsEnabled[indexPe] = productSelected;
              }
            });
          });
        }
        $scope.products = tmpProductsEnabled;
      })
      .catch(function(err) {
        $log.error('Server error on get products.');
      });


    $scope.order.timeInitial = new Date();
    $scope.order.timeInitial.setHours($scope.formToUpdate ? orderParam.initialSuggestedTime.split(":")[0] : 12);
    $scope.order.timeInitial.setMinutes($scope.formToUpdate ? orderParam.initialSuggestedTime.split(":")[1] : 0);
    $scope.order.timeFinal = new Date();
    $scope.order.timeFinal.setHours($scope.formToUpdate ? orderParam.finalSuggestedTime.split(":")[0] : $scope.order.timeInitial.getHours() + 2);
    $scope.order.timeFinal.setMinutes($scope.formToUpdate ? orderParam.finalSuggestedTime.split(":")[1] : $scope.order.timeInitial.getMinutes());

    $scope.order.hstep = 1;
    $scope.order.mstep = 10;
    $scope.order.minTimeInitial = new Date();
    $scope.order.minTimeInitial.setHours(9);
    $scope.order.minTimeInitial.setMinutes(0);
    $scope.order.maxTimeInitial = new Date();
    $scope.order.maxTimeInitial.setHours(18);
    $scope.order.maxTimeInitial.setMinutes(0);
    $scope.order.minTimeFinal = new Date();
    $scope.order.minTimeFinal.setHours($scope.order.timeInitial.getHours() + 2);
    $scope.order.minTimeFinal.setMinutes($scope.order.timeInitial.getMinutes());
    $scope.order.maxTimeFinal = $scope.order.maxTimeInitial;


    // Dropdown para listar los empleados del cliente
    ClientSvc.getClientEmployees()
      .then(function(res) {
        $scope.placement = {
          options: res.data,
          selected: res.data[0],
        };
        if ($scope.formToUpdate) {
          res.data.forEach(function(employee) {
            if (employee.id == orderParam.clientEmployee) {
              $scope.placement.selected = employee;
            }
          })
        }
      });

    // Function to update a order.
    $scope.updateOrder = function() {
      var productsToUpdate = [];
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
        productsToUpdate.push(product);
      });

      tmpDeliveryDate = $scope.order.dt.getTime() + (-(new Date().getTimezoneOffset()) * 60 * 1000);
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
        orderId: orderParam.id,
        deliveryDate: tmpDeliveryDate,
        clientEmployee: tmpClientEmployee,
        initialSuggestedTime: tmpInitialTime,
        finalSuggestedTime: tmpFinalTime,
        additionalInformation: tmpInformation,
        productsToUpdate: productsToUpdate
      }

      ClientSvc.updateOrder(orderCredentials)
        .then(function(res) {
          $ngConfirm({
            title: 'Pedido actualizado.',
            content: 'El pedido ha sido actualizado con exito.',
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
        })
        .catch(function(err) {
          $ngConfirm('El pedido no ha sido actualizado, verifique la fecha de entrega.');
          $log.error(err);
        });
    }

    $scope.confirm = function() {
      ProfileService.getProfileClient()
        .then(function(res) {
          $scope.client = res.data;
          $ngConfirm({
            title: 'Resumen del pedido',
            contentUrl: 'templates/private/client/order-summary.html',
            scope: $scope,
            theme: 'light',
            columnClass: 'medium',
            backgroundDismiss: true,
            buttons: {
              confirm: {
                text: 'Confirmar',
                btnClass: 'btn-blue',
                keys: ['enter', 'a'],
                action: function(scope, button) {
                  if ($scope.formToUpdate) {
                    $scope.updateOrder();
                  } else {
                    $scope.makeOrder();
                  }
                }
              },
              Cancelar: function() {

              }
            }
          })
        })
        .catch(function(err) {
          $ngConfirm('No se ha podido obtener la información del perfil.');
        })
    }

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

      tmpDeliveryDate = $scope.order.dt.getTime() + (-(new Date().getTimezoneOffset()) * 60 * 1000);
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

      console.log(orderCredentials);

      ClientSvc.makeOrder(orderCredentials)
        .then(function(res) {
          $scope.deliveryDateEstablished = res.data.deliveryDate;
          $ngConfirm({
            title: 'Pedido realizado.',
            scope: $scope,
            content: "El pedido ha quedado registrado con fecha de entrega: {{deliveryDateEstablished | date:'fullDate' | capitalize}} ",
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
        $ngConfirm('Debe seleccionar al menos un producto.');
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
      $scope.order.timeFinal = new Date();
      $scope.order.timeFinal.setHours($scope.order.timeInitial.getHours() + 2);
      $scope.order.timeFinal.setMinutes($scope.order.timeInitial.getMinutes());
      $scope.deliveryDateDefault();
      $scope.$apply();
    }

    $scope.changedInitial = function() {
      $scope.order.timeFinal = new Date();
      $scope.order.timeFinal.setHours($scope.order.timeInitial.getHours() + 2);
      $scope.order.timeFinal.setMinutes($scope.order.timeInitial.getMinutes());
      $scope.order.minTimeFinal = new Date();
      $scope.order.minTimeFinal.setHours($scope.order.timeInitial.getHours() + 2);
      $scope.order.minTimeFinal.setMinutes($scope.order.timeInitial.getMinutes());
    };

    $scope.changedFinal = function() {
    };

    // Datepicker para la fecha de entrega
    $scope.deliveryDateDefault = function() {
      if ($scope.formToUpdate) {
        $scope.order.dt = new Date(orderParam.deliveryDate);
      } else {
        $scope.order.dt = new Date();
        if ($scope.order.dt.getDay() == 6) {
          $scope.order.dt.setDate($scope.order.dt.getDate() + 2);
        } else {
          $scope.order.dt.setDate($scope.order.dt.getDate() + 1);
        }
      }
    };
    $scope.deliveryDateDefault();

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);

    $scope.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    $scope.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: $scope.formToUpdate ? new Date(orderParam.deliveryDate) : tomorrow,
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
  }
]);
