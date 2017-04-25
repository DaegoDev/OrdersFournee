var fournee = angular.module('fournee');
fournee.controller('productCreateCtrl', ['$scope', '$log', '$state', '$ngConfirm', 'productItemSvc', 'productSvc', function($scope, $log, $state, $ngConfirm, productItemSvc, productSvc) {
  $scope.product = {};
  $scope.selectedItems = [];
  $scope.items = null;
  $scope.product.name = '';
  $scope.product.shortName = '';
  // Message options configuration to further error messages.
  $scope.messageOptions = {
    showMessage: false,
    message: '',
    type: 'success',
    title: ''
  }

  productItemSvc.getAll()
    .then(function(res) {
      $scope.items = res.data
    });

  $scope.createProduct = function() {
    var items = [];
    $scope.selectedItems.forEach(function(item, index, itemList) {
      items.push({
        id: item.id,
        name: item.name,
        value: item.value,
        shortValue: item.shortValue
      });
    });
    productSvc.createProduct({
        items: items
      })
      .then(function(res) {
        $ngConfirm({
          title: 'Producto creado.',
          content: 'El producto ha sido creado con exito.',
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
        $log.warn(res.data);
      })
      .catch(function(err) {
        $scope.messageOptions = {
          showMessage: true,
          message: 'El producto no ha sido creado, es posible que el producto ya exista ' +
            'o el servidor no esté disponible.',
          type: 'error',
          title: 'Error.'
        }
        $log.info(err);
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
          action: function(scope, button) {

          }
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
      for (var i in newValue) {
        name = name + newValue[i].value + ' ';
        shortName = shortName + newValue[i].shortValue + ' ';
      }
      $scope.product.name = name.trim();
      $scope.product.shortName = shortName.trim();
    }
  }, true);


}]);
