var fournee = angular.module('fournee');

  fournee.directive('productCard', function() {
    return {
      restric: 'E',
      templateUrl: 'templates/private/shared/product-card.html',
      scope: {
        product: '=',
        type: '@',
        selectList: '=?',
        control: '=?'
      },
      controller: 'productCardCtrl',
    }
  })

  fournee.controller('productCardCtrl', ['$scope', '$log','ClientSvc', '$ngConfirm', productCardCtrl]);

  function productCardCtrl($scope, $log, ClientSvc, $ngConfirm) {
    // Control variables to manage the behaviour of the directive base on the type value.
    $scope.dirControl = null;
    $scope.clientProduct = null;
    $scope.name = '';
    // Tooltip popover options
    $scope.tooltip = {
      content: "",
      templateUrl: '/templates/private/shared/product-card-tooltip.html',
      tittle: 'Elementos'
    }

    // Control variables to manage the two type of order products (raw or baked).
    $scope.currentSettings = {baked: "", amount: 0}
    $scope.baked = "";
    $scope.amount = 0;
    var rawProduct = null;
    var bakedProduct = null;

    if (!$scope.control) {
      $scope.control = {};
    }
    $scope.dirControl = $scope.control;

    // Check which type of directive is used, then set the corresponding values.
    if ($scope.type == 'orderProduct') {

      $scope.dirProduct = $scope.product.product;
      $scope.clientProduct = {
        clientId: $scope.clientId,
        clientProductId: $scope.id
      }
      if ($scope.product.customName) {
        $scope.name = $scope.product.customName;
      } else {
        $scope.name = $scope.dirProduct.shortName;
      }
    } else if ($scope.type == 'select') {
      $scope.class = ['select'];
      $scope.dirProduct = $scope.product;
      $scope.name = $scope.product.shortName;
    } else if ($scope.type == 'list') {
      $scope.class = ['list'];
      $scope.dirProduct = $scope.product;
      $scope.name = $scope.product.shortName;
    }

    $scope.toggleCollapse = function() {
      $scope.collapsed = !$scope.collapsed;
    }

    // API functions exposed.
    // Function to get the current amount of items.
    $scope.dirControl.getAmount = function() {
      return $scope.amount;
    }

    // Function to get the current type of product (Baked = true, Raw = false).
    $scope.dirControl.getBaked = function() {
      return $scope.baked;
    }

    // Function to get the configured product with name, amount and type.
    $scope.dirControl.getProduct = function() {
      return buildProduct();
    }

    $scope.dirControl.selectProduct = function () {
      return $scope.product;
    }

    // function to remove a product saved in the selectList.
    $scope.dirControl.removeProduct = function(product) {
      var index = $scope.selectList.indexOf(product);
      if (index != -1) {
        $scope.selectList.splice(index, 1);
      }
      if (rawProduct == product) {
        rawProduct = null;
      } else if (bakedProduct == product) {
        bakedProduct = null;
      }
    }

    // Function to reset directive to default values
    $scope.dirControl.reset = function() {
      $scope.currentSettings.baked = false;
      $scope.currentSettings.amount = 0;
      rawProduct = null;
      bakedProduct = null;
    }

    // Function to add a product to the list passed as attribute.
    $scope.addProductToList = function() {
      if (!$scope.currentSettings.state) {
        $ngConfirm({
          title: 'Error',
          content: 'Debe seleccionar si desea añadir el producto horneado o congelado.',
          backgroundDismiss: true,
          buttons: {
            confirm: {
              text: 'Aceptar',
              btnClass: 'btn-sienna',
              action: function (scope, button) {
              }
            }
          }
        });
        return;
      }
      if ($scope.currentSettings.amount == 0) {
        $ngConfirm({
          title: 'Error',
          content: 'Debe ingresar la cantidad de productos que desea añadir.',
          backgroundDismiss: true,
          buttons: {
            confirm: {
              text: 'Aceptar',
              btnClass: 'btn-sienna',
              action: function (scope, button) {
              }
            }
          }
        });
        return;
      }

      var product = buildProduct();
      if (product) {
        var index = $scope.selectList.indexOf(product);
        if (index == -1) {
          $scope.selectList.push(product);
        }
      }
    }

    // Function to build current product selected.
    function buildProduct() {
      var currentProduct = null;
      if ($scope.currentSettings.state == 'frozen' && !rawProduct) {
        rawProduct = {
          client_product: $scope.product.id,
          name: $scope.name,
          amount: 0,
          baked: false
        }
      } else if ($scope.currentSettings.state == 'baked' && !bakedProduct) {
        bakedProduct = {
          client_product: $scope.product.id,
          name: $scope.name,
          amount: 0,
          baked: true
        }
      } else if (!$scope.currentSettings.state) {
        return;
      }

      if ($scope.currentSettings.state == 'baked') {
        currentProduct = bakedProduct;
      } else if ($scope.currentSettings.state == 'frozen') {
        currentProduct = rawProduct;
      }
      currentProduct.amount += $scope.currentSettings.amount;
      return currentProduct;
    }

    $scope.getTitleColor = function(product) {
      var dough = '';
      product.items.forEach(function (item, i) {
        if (item.elementName.toUpperCase().trim() == 'MASA') {
          dough = item.value + item.shortValue + item.elementName;
        }
      });
      var colorHash = new ColorHash({lightness: [0.35, 0.3, 0.25]});
      return {'background-color': colorHash.hex(dough)}
    }

    $scope.changeCustomName = function (producCode) {
      $ngConfirm({
        title: 'Cambiar nombre',
        content: 'Ingrese el nombre que desea asignarle al producto.<br> <input type="text" ng-model="customName" class="form-control"/>'+
        '<br><alert-message options="messageModalOptions"></alert-message>',
        backgroundDismiss: true,
        scope: $scope,
        buttons: {
          exit: {
            text: 'Salir',
            btnClass: 'btn-sienna',
            action: function (scope, button) {
            }
          },
          confirm: {
            text: 'Aceptar',
            btnClass: 'btn-sienna',
            action: function (scope, button) {
              if (!$scope.customName) {
                $scope.messageModalOptions = {
                  showMessage: true,
                  message: 'Debe ingresar un nombre para el producto.',
                  type: 'error',
                  title: 'Error.'
                }
                return false;
              }
              $scope.changeName();
            }
          }
        }
      });
    }

    $scope.changeName = function () {
      if (!$scope.customName) {
        return;
      }
      ClientSvc.changeProductName({
          productCode: $scope.dirProduct.code,
          customName: $scope.customName
        })
        .then(function (res) {
          $scope.name = $scope.customName;
          $scope.product.customName = $scope.customName;
        })
        .catch(function (err) {
          $ngConfirm('El nombre del producto no ha sido cambiado, porfavor intente de nuevo.', 'Error');
        });
    }
  }
