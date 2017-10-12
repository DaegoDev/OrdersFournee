var fournee = angular.module('fournee');
fournee.controller('productCreateCtrl', ['$scope', '$log', '$state', '$ngConfirm', 'productItemSvc', 'productSvc',
  function($scope, $log, $state, $ngConfirm, productItemSvc, productSvc) {
    $scope.product = {};
    $scope.selectedItems = [];
    $scope.items = null;
    $scope.product.name = '';
    $scope.product.shortName = '';
    $scope.product.price = '';

    // Message options configuration to further error messages.
    $scope.messageOptions = {
      showMessage: false,
      message: '',
      type: 'success',
      title: ''
    }

    productItemSvc.getProductPriority()
      .then(function(res) {
        $scope.priorities = res.data;
        $scope.items = [];

        // Lets create the item array with mandatory elements firts.
        $scope.priorities.mandatory.forEach(function(element, i, elements) {
          $scope.items.push('&' + element.toUpperCase().trim() + '&');
        });
        return productItemSvc.getAll();
      })
      .then(function(res) {
        // Lets sort elements in mandatory order, then in created order.
        data = res.data
        data.forEach(function(element, i, elements) {
          index = $scope.items.indexOf('&' + element.name.toUpperCase().trim() + '&');
          if (index == -1) {
            $scope.items.push(element);
          } else {
            $scope.items[index] = element;
          }
        });
      });

      $scope.formatNumber = function () {
        if (!$scope.product.price) {
          return;
        }
        var number = $scope.product.price.replace(/\D/g,'');
        console.log("number begin " + number);
        var numberLength = number.length
        if (numberLength > 3) {
          var n = Math.trunc(numberLength / 3);
          console.log(n);
          for (var i = 1; i <= n; i++) {
            var arrNumber = number.split("");
            var index = (numberLength - (3 * i));
            if (index != 0) {
              arrNumber.splice(index, 0, '.');
            }
            number = arrNumber.join("");
          }
        }
        console.log(number);
        $scope.product.price = number;
      }

    $scope.createProduct = function() {
      var items = [];
      var price = null;
      $scope.selectedItems.forEach(function(item, index, itemList) {
        items.push({
          id: item.id,
          name: item.name,
          value: item.value,
          shortValue: item.shortValue
        });
      });
      price = $scope.product.price.replace(/\D/g,'');
      if (price == null || parseInt(price) <= 0) {
        $scope.messageOptions = {
          showMessage: true,
          message: 'Debe ingresar correctamente el precio. ',
          type: 'error',
          title: 'Error.'
        }
        return;
      }
      
      productSvc.createProduct({
          items: items,
          price: price,
        })
        .then(function(res) {
          $ngConfirm({
            title: 'Producto creado.',
            content: 'El producto ha sido creado con éxito.',
            type: 'green',
            buttons: {
              new: {
                text: 'Crear nuevo',
                btnClass: 'btn-sienna',
                action: function(scope, buttons) {
                  $scope.reset();
                  $scope.$apply();
                  $state.go('product.create');
                }
              },
              exit: {
                text: 'Ver lista',
                btnClass: 'btn-sienna',
                action: function(scope, buttons) {
                  $state.go('product.list')
                }
              }
            }
          });
        })
        .catch(function(err) {
          if (err.data.code == 3 || err.data.code == 1) {
            var mandatoryStr = '';
            $scope.priorities.mandatory.forEach(function(element, i) {
              mandatoryStr = mandatoryStr + ' ' + element.trim() + ',';
            });
            mandatoryStr = mandatoryStr.substr(0, mandatoryStr.length - 1) + '.';
            $scope.messageOptions = {
              showMessage: true,
              message: 'Debe ingresar: ' + mandatoryStr,
              type: 'error',
              title: 'Error.'
            }
          } else if (err.data.code == 4) {
            $scope.messageOptions = {
              showMessage: true,
              message: 'El producto que desea crear ya existe',
              type: 'error',
              title: 'Error.'
            }
          } else if (err.data.code == 5) {
            $scope.messageOptions = {
              showMessage: true,
              message: 'El precio no se ha enviado',
              type: 'error',
              title: 'Error.'
            }
          } else {
            $scope.messageOptions = {
              showMessage: true,
              message: 'El producto no ha sido creado, es posible que el servidor no esté disponible.',
              type: 'error',
              title: 'Error.'
            }
          }
        });
    }

    $scope.modalCreateElement = function() {
      $ngConfirm({
        title: 'Crear elemento',
        content: '<input type="text" class="form-control" ng-model="elementName" placeholder="Ingrese el nombre del elemento.">' +
          '<br><alert-message options="messageModalOptions"></alert-message>',
        backgroundDismiss: true,
        scope: $scope,
        buttons: {
          exit: {
            text: 'Cancelar',
            btnClass: 'btn-sienna',
            action: function(scope, button) {}
          },
          confirm: {
            text: 'Confirmar',
            keys: ['enter'],
            btnClass: 'btn-sienna',
            action: function(scope, button) {
              if (!$scope.elementName) {
                $scope.messageModalOptions = {
                  showMessage: true,
                  message: 'Debe ingresar un nombre para el nuevo elemento.',
                  type: 'error',
                  title: 'Error.'
                }
                return false;
              }
              $scope.createElement();
            }
          }
        }
      });
    }

    $scope.createElement = function() {
      productItemSvc.createElement({
          name: $scope.elementName
        })
        .then(function(res) {
          $scope.items.push(res.data);
          $scope.elementName = '';
          $scope.messageModalOptions.showMessage = false;
          $ngConfirm({
            title: 'Elemento creado.',
            content: 'El elemento ha sido creado exitosamente.',
            type: 'green',
            backgroundDismiss: true,
            scope: $scope,
            buttons: {
              exit: {
                text: 'salir',
                keys: ['enter'],
                btnClass: 'btn-sienna',
                action: function(scope, button) {}
              }
            }
          });
        })
        .catch(function(err) {
          $scope.messageModalOptions.showMessage = false;
          $scope.elementName = '';
          $ngConfirm({
            title: 'Error',
            content: 'El elemento no ha sido creado, es posible que el elemento ya exista o que el servidor no esté disponible.',
            type: 'red',
            backgroundDismiss: true,
            scope: $scope,
            buttons: {
              exit: {
                text: 'salir',
                keys: ['enter'],
                btnClass: 'btn-sienna',
                action: function(scope, button) {}
              }
            }
          });
          $log.error('The element has not been created.');
        });
    }

    $scope.reset = function() {
      $scope.items.forEach(function(item, index, items) {
        item.control.reset();
      });
    }

    $scope.$watch('selectedItems', function functionName(newValue, oldValue, scope) {
      if (newValue != oldValue) {
        var name = '';
        var shortName = '';

        $scope.priorities.order.forEach(function(element, i, elements) {
          name = name + '&' + element.toUpperCase().trim() + '&';
          shortName = shortName + '&' + element.toUpperCase().trim() + '&';
        });

        $scope.selectedItems.forEach(function(item, i, items) {
          name = name.replace('&' + item.name.toUpperCase().trim() + '&', item.value + ' ')
          shortName = shortName.replace('&' + item.name.toUpperCase().trim() + '&', item.shortValue + ' ')
        });

        $scope.priorities.order.forEach(function(element, i, elements) {
          name = name.replace('&' + element.toUpperCase().trim() + '&', '');
          shortName = shortName.replace('&' + element.toUpperCase().trim() + '&', '');
        });

        $scope.product.name = name.trim();
        $scope.product.shortName = shortName.trim();
      }
    }, true);
  }
]);
