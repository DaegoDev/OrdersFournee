  var fournee = angular.module('fournee');
  fournee.controller('ClientDetailsCtrl', ['$scope', '$log', '$state', '$stateParams', '$ngConfirm', 'ClientSvc', 'productSvc', 'ReceptionHourSvc', 'StorageService',
    function($scope, $log, $state, $stateParams, $ngConfirm, ClientSvc, productSvc, ReceptionHourSvc, StorageService) {

      $scope.client = JSON.parse(StorageService.get('client', 'session'));
      $scope.selectedProducts = [];
      $scope.receptionHour = [];
      $scope.simbolGeneral = 'G';
      $scope.simbolSpecial = 'E';

      ReceptionHourSvc.getReceptionHourByClient({
          clientId: $scope.client.id
        })
        .then(function(res) {
          $scope.receptionHour = res.data;
        })
        .catch(function(err) {

        })

      if (!$scope.client) {
        $state.go('client.list');
      } else {
        getClientProducts();
      }

      console.log($scope.client);

      // Function to enable the products selected to the current client.
      $scope.enableProducts = function() {
        var productCodes = [];
        var client = {};
        angular.forEach($scope.selectedProducts, function(product, key) {
          productCodes.push({
            product: product.code,
            customPrice: product.customPrice
          });
        })

        client.clientId = $scope.client.id;
        client.products = productCodes;
        ClientSvc.enableProducts(client)
          .then(function(res) {
            $scope.hideProducts();
            getClientProducts();
          })
          .catch(function(err) {
            $log.error('Can\'t enable the products, have you selected at least one product?');
          });;
      }

      $scope.disableProduct = function(customProduct) {
        $ngConfirm({
          title: 'Alerta!!',
          content: 'Está seguro que desea eliminar el producto <b>' + customProduct.product.name + '</b>?',
          buttons: {
            exit: {
              text: 'Salir',
              btnClass: 'btn-sienna',
              action: function() {}
            },
            confirm: {
              text: 'Confirmar',
              btnClass: 'btn-sienna',
              action: function() {
                var client = {
                  clientId: $scope.client.id,
                  product: customProduct.product.code
                }
                ClientSvc.disableProduct(client)
                  .then(function(res) {
                    getClientProducts();
                    $log.debug('The client\'s product has been disabled');
                  })
                  .catch(function(err) {
                    $ngConfirm('El producto no se ha podido deshabilitar.', 'Error.')
                    $log.error('The client\'s product has not been disabled');
                  });
              }
            }
          }
        });
      }

      // Function to format the number in input price.
      $scope.formatNumber = function(number, type) {
        if (!number) {
          return;
        }
        var number = number.replace(/\D/g, '');
        var numberLength = number.length
        if (numberLength > 3) {
          var n = Math.trunc(numberLength / 3);
          for (var i = 1; i <= n; i++) {
            var arrNumber = number.split("");
            var index = (numberLength - (3 * i));
            if (index != 0) {
              arrNumber.splice(index, 0, '.');
            }
            number = arrNumber.join("");
          }
        }
        if (type === 1) {
          $scope.customPrice = number;
        } else if (type === 2) {
          $scope.newCustomPrice = number;
        } else if (type === 3) {
          $scope.client.minOrderPrice = number;
        }
      }

      if ($scope.client.minOrderPrice) {
        $scope.formatNumber($scope.client.minOrderPrice.toString(), 3)
      }

      // Function to update the min order price for the client.
      $scope.setMinOrderPrice = function () {
        var minOrderPrice = null;
        var clientId = null

        minOrderPrice = $scope.client.minOrderPrice;
        clientId = $scope.client.id;

        if (!minOrderPrice || !clientId) {
          return;
        }

        var params = {
          clientId: clientId,
          minOrderPrice: minOrderPrice.replace(/\D/g, '')
        }

        ClientSvc.setMinOrderPrice(params)
        .then((res) => {
          $scope.formatNumber(minOrderPrice, 3)
          $ngConfirm({
            title: 'Exito',
            content: 'Se actualizó correctamente.',
            type: 'green',
            autoClose: 'ok|2000',
            buttons: {
              ok: {
                text: 'Ok',
                action: function () {

                }
              }
            }
          })
        })
        .catch((err) => {
          console.log(err);
          $ngConfirm({
            title: 'Error',
            content: 'No se pudo actualizar el precio minimo para los pedidos.',
            type: 'red',
            autoClose: '8000',
          })
        })

      }

      // Function to open the form to add the custom price;
      $scope.setSpecialPrice = function(customProduct) {
        console.log(customProduct);
        $scope.customPriceEnabled = customProduct.customPrice ? true : false;
        $ngConfirm({
          title: 'Asignar precio',
          content: 'Ingrese el precio que desea asignarle al producto ' + customProduct.product.name + ', para el cliente ' + $scope.client.tradeName +
            '.<br><div class="form-group"><input type="text" ng-model="customPrice" ng-change="formatNumber(' + "customPrice" + ', 1)" class="form-control"/> </div>' +
            '<br><alert-message options="messageModalOptions"></alert-message>',
          backgroundDismiss: true,
          scope: $scope,
          onClose: function() {
            $scope.customPrice = '';
            if ($scope.messageModalOptions) {
              $scope.messageModalOptions.showMessage = false;
            }
          },
          buttons: {
            removePrice: {
              text: 'Precio general',
              btnClass: 'btn-green',
              disabled: !$scope.customPriceEnabled,
              action: function(scope, button) {
                var clientProduct = {
                  clientId: $scope.client.id,
                  productCode: customProduct.product.code,
                  customPrice: "#"
                }
                $scope.changePrice(clientProduct);
              }
            },
            exit: {
              text: 'Salir',
              btnClass: 'btn-sienna',
              action: function(scope, button) {}
            },
            confirm: {
              text: 'Aceptar',
              btnClass: 'btn-sienna',
              action: function(scope, button) {
                if (!$scope.customPrice) {
                  $scope.messageModalOptions = {
                    showMessage: true,
                    message: 'Debe ingresar un precio para el producto.',
                    type: 'error',
                    title: 'Error.'
                  }
                  return false;
                }
                var clientProduct = {
                  clientId: $scope.client.id,
                  productCode: customProduct.product.code,
                  customPrice: $scope.customPrice.replace(/\D/g, '')
                }
                $scope.changePrice(clientProduct);
              }
            }
          }
        });
      }

      // Set the special price defined by admin;
      $scope.changePrice = function(clientProduct) {
        if (!$scope.customPrice && clientProduct.customPrice != "#") {
          return;
        }
        ClientSvc.changeProductPrice(clientProduct)
          .then(function(res) {
            console.log(res.data);
            getClientProducts();
            $scope.customPrice = '';
          })
          .catch(function(err) {
            $ngConfirm('El precio del producto no ha sido cambiado, porfavor intente de nuevo.', 'Error');
          });
      }

      // Function to disable/delete the current client.
      $scope.disableClient = function() {
        $ngConfirm({
          title: 'Alerta!!',
          content: 'Está a punto de deshabilitar al cliente <b>' + $scope.client.legalName + '</b>',
          backgroundDismiss: true,
          buttons: {
            exit: {
              text: 'Salir',
              btnClass: 'btn-sienna',
              action: function() {}
            },
            confirm: {
              text: 'Confirmar',
              btnClass: 'btn-sienna',
              action: function() {
                ClientSvc.disableClient({
                    clientId: $scope.client.id
                  })
                  .then(function(res) {
                    $ngConfirm('El cliente ha sido deshabilitado.', 'Cliente deshabilitado.')
                    $scope.client.user.state = 0;
                    $log.debug(res);
                  })
                  .catch(function(err) {
                    $log.error('The client has not been disabled.');
                  });
              }
            }
          }
        });

      }

      // Function to show the module of product list to enable products.
      $scope.showProducts = function() {
        $scope.enablingProduct = true;
        $scope.selectedProducts = [];
        // Service call to get all products.
        productSvc.getProducts()
          .then(function(res) {
            $scope.products = res.data;
            // We show only those products that are not enabled yet.
            angular.forEach($scope.products, function(product, i) {
              angular.forEach($scope.client.products, function(clientProduct, j) {
                if (clientProduct.product.code == product.code) {
                  $scope.products[i].hide = true;
                }
              });
            });
          })
          .catch(function(err) {
            $log.error('Can\'t get product list');
          });
      }

      // Function to hide the module of product list;
      $scope.hideProducts = function() {
        $scope.enablingProduct = false;
      }

      // Function to select a product, hide it from the list and show it in the
      // selected products.
      $scope.selectProduct = function(product) {
        $ngConfirm({
          title: 'Asignar precio',
          content: 'Desea asignar precio especial para este producto.',
          backgroundDismiss: false,
          scope: $scope,
          onClose: function() {
            $scope.newCustomPrice = '';
            if ($scope.messageModalOptions) {
              $scope.messageModalOptions.showMessage = false;
            }
          },
          buttons: {
            set: {
              text: 'Asignar',
              btnClass: 'btn-sienna',
              action: function(scope, button) {
                $ngConfirm({
                  title: 'Asignar precio',
                  content: 'Ingrese el precio especial ' +
                    '.<br> <input type="text" ng-model="newCustomPrice" ng-change="formatNumber(' + "newCustomPrice" + ', 2)" class="form-control"/>' +
                    '<br><alert-message options="messageModalOptions"></alert-message>',
                  backgroundDismiss: false,
                  scope: $scope,
                  buttons: {
                    cancel: {
                      text: 'Cancelar',
                      btnClass: 'btn-sienna',
                      action: function(scope, button) {

                      }

                    },
                    accept: {
                      text: 'Aceptar',
                      btnClass: 'btn-sienna',
                      action: function(scope, button) {
                        if (!$scope.newCustomPrice) {
                          $scope.messageModalOptions = {
                            showMessage: true,
                            message: 'Debe ingresar un precio para el producto.',
                            type: 'error',
                            title: 'Error.'
                          }
                          return false;
                        }
                        var index = $scope.selectedProducts.indexOf(product);
                        if (index == -1) {
                          product.customPrice = $scope.newCustomPrice.replace(/\D/g, '');
                          product.sectionGeneralPrice = false;
                          $scope.selectedProducts.push(product);
                          $scope.newCustomPrice = '';
                          product.hide = true;
                        }

                      }
                    }
                  }
                });
              }
            },
            continue: {
              text: 'Continuar',
              btnClass: 'btn-sienna',
              action: function(scope, button) {
                var index = $scope.selectedProducts.indexOf(product);
                if (index == -1) {
                  product.sectionGeneralPrice = true;
                  $scope.selectedProducts.push(product);
                  product.hide = true;
                }
              }
            }
          }
        });
      }

      //Function to un-select deselect a product from the selected products and
      // show it back on the product list.
      $scope.deselectProduct = function(product) {
        var index = $scope.selectedProducts.indexOf(product);
        if (index != -1) {
          $scope.selectedProducts.splice(index, 1);
          product.hide = false;
        };
      }

      // Function to get all products enabled for a client, it is not linked to $scope.
      function getClientProducts() {
        $scope.client.products = null;
        productSvc.getProductsByClient({
            clientId: $scope.client.id
          })
          .then(function(res) {
            $scope.client.products = res.data;
          })
          .catch(function(err) {
            $log.error('Cant\' get the client products.');
          });
      }
    }
  ]);
