  var fournee = angular.module('fournee');
  fournee.controller('ClientDetailsCtrl', ['$scope', '$log', '$state', '$stateParams', '$ngConfirm', 'ClientSvc', 'productSvc', 'ReceptionHourSvc', 'StorageService',
    function($scope, $log, $state, $stateParams, $ngConfirm, ClientSvc, productSvc, ReceptionHourSvc, StorageService) {

      $scope.client = JSON.parse(StorageService.get('client', 'session'));
      $scope.selectedProducts = [];
      $scope.receptionHour = [];
      $scope.simbolGeneral = 'G';
      $scope.simbolSpecial = 'E';
      $scope.updateGeneralInfo = false;
      $scope.enableFieldGI = "";
      $scope.updateDeliveryAddress = false;
      $scope.enableFieldAD = "";



      // Error control variables general info.
      $scope.infoMsgOptionsGI = {
        showMessage: false,
        message: '',
        type: 'error',
        title: ''
      }

      // Error control variables delivery address.
      $scope.infoMsgOptionsAD = {
        showMessage: false,
        message: '',
        type: 'error',
        title: ''
      }

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

      //Function to reset the password of a client.
      $scope.resetPasswordConfirm = function () {
        // confirm of the action.
        $ngConfirm({
          title: 'Alerta!!',
          content: '<b>¿Está seguro que desea restaurar la contraseña del cliente ' + $scope.client.legalName + '</b>?' +
            '<br><p>Si confirma esta acción la contraseña del cliente será: 123456</p>',
          buttons: {
            exit: {
              text: 'Salir',
              // btnClass: 'btn-sienna',
              action: function() {}
            },
            confirm: {
              text: 'Confirmar',
              btnClass: 'btn-sienna',
              action: function() {
                var client = {
                  clientId: $scope.client.id,
                }
                ClientSvc.resetPassword(client)
                .then((res) => {
                  $ngConfirm({
                    title: 'Proceso exitoso',
                    content: 'Se reseteó la contraseña del cliente ' + $scope.client.legalName,
                    buttons: {
                      ok: {
                        text: 'Ok',
                        btnClass: 'btn-sienna',
                        action: function () {

                        }
                      }
                    }
                  })
                })
                .catch((err) => {
                  console.log(err);
                  $ngConfirm({
                    title: 'Error!',
                    content: 'No se pudo resetear la contraseña del cliente ' + $scope.client.legalName + ', intente más tarde.',
                    buttons: {
                      ok: {
                        text: 'Ok',
                        btnClass: 'btn-sienna',
                        action: function () {

                        }
                      }
                    }
                  })
                })
              }
            }
          }
        });
      }

      // Enable de inputs to edit de data in general info section and copy de data.
      $scope.enableFieldsGI = function () {
        $scope.updateGeneralInfo = true;
        $scope.enableFieldGI = "field-enable";
        var clientOriginalCopy = {
          legalName: $scope.client.legalName,
          nit: $scope.client.nit,
          tradeName: $scope.client.tradeName,
          businessPhonenumber: $scope.client.businessPhonenumber,
          email: $scope.client.email,
          ownerName: $scope.client.ownerName,
          ownerPhonenumber: $scope.client.ownerPhonenumber,
          additionalInformation: $scope.client.additionalInformation
        };
        $scope.clientOriginalCopy = clientOriginalCopy;
      }

      // Cancel the action of edit of general data before the data is saved.
      $scope.cancelUpdateGeneralInfo = function () {
        $scope.client.legalName = $scope.clientOriginalCopy.legalName;
        $scope.client.nit = $scope.clientOriginalCopy.nit;
        $scope.client.tradeName = $scope.clientOriginalCopy.tradeName;
        $scope.client.businessPhonenumber = $scope.clientOriginalCopy.businessPhonenumber;
        $scope.client.email = $scope.clientOriginalCopy.email;
        $scope.client.ownerName = $scope.clientOriginalCopy.ownerName;
        $scope.client.ownerPhonenumber = $scope.clientOriginalCopy.ownerPhonenumber;
        $scope.client.additionalInformation = $scope.clientOriginalCopy.additionalInformation;
        $scope.updateGeneralInfo = false;
        $scope.enableFieldGI = "";
      }

      // Create the params to realize the request to edit of general information.
      $scope.saveNewGeneralInfo = function () {
        var legalName = $scope.client.legalName;
        var nit = $scope.client.nit;
        var tradeName = $scope.client.tradeName;
        var email = $scope.client.email;
        var ownerName = $scope.client.ownerName;
        var ownerPhonenumber = $scope.client.ownerPhonenumber;
        var businessPhonenumber = $scope.client.businessPhonenumber;

        if (!legalName) {
          $scope.infoMsgOptionsGI.message = 'Debe ingresar el nombre de la razón social.';
          $scope.infoMsgOptionsGI.showMessage = true;
          return;
        }
        if (!nit) {
          $scope.infoMsgOptionsGI.message = 'Debe ingresar el nit de la empresa.';
          $scope.infoMsgOptionsGI.showMessage = true;
          return;
        }
        if (!tradeName) {
          $scope.infoMsgOptionsGI.message = 'Debe ingresar el nombre de la empresa.';
          $scope.infoMsgOptionsGI.showMessage = true;
          return;
        }

        var clientCredentials = {
          legalName: legalName,
          nit: nit,
          tradeName: tradeName,
          email: email,
          ownerName: ownerName,
          ownerPhonenumber: ownerPhonenumber,
          businessPhonenumber: businessPhonenumber,
          clientId: $scope.client.id
        }

        ClientSvc.updateGeneralInfoAdmin(clientCredentials)
          .then(function(res) {
            var clientUpdated = res.data;
            $scope.client.legalName = clientUpdated.legalName;
            $scope.client.nit = clientUpdated.nit;
            $scope.client.tradeName = clientUpdated.tradeName;
            $scope.client.email = clientUpdated.email;
            $scope.client.ownerName = clientUpdated.ownerName;
            $scope.client.ownerPhonenumber = clientUpdated.ownerPhonenumber;
            $scope.client.businessPhonenumber = clientUpdated.businessPhonenumber;
            showMessageSuccessGI("Información actualizada!");
            $scope.updateGeneralInfo = false;
            $scope.enableFieldGI = "";
          })
          .catch(function(err) {
            console.log(err);
            if (err.data.statusCode == 400) {
              $scope.infoMsgOptionsGI.message = 'El NIT o Razón social ya existen.';
              $scope.infoMsgOptionsGI.showMessage = true;
            }else {
              $scope.infoMsgOptionsGI.message = 'No se ha podido actualizar la información.';
              $scope.infoMsgOptionsGI.showMessage = true;
            }
          })
      }

      // Show the success message after save of general information.
      function showMessageSuccessGI(message) {
        $scope.infoMsgOptionsGI.type = 'success';
        $scope.infoMsgOptionsGI.message = message;
        $scope.infoMsgOptionsGI.showMessage = true;
        setTimeout(function () {
          $scope.infoMsgOptionsGI.type = 'error';
          $scope.infoMsgOptionsGI.showMessage = false;
        }, 2000);
      }

      // Enable de inputs to edit data in delivery address section and copy de data.
      $scope.enableFieldsAD = function () {
        $scope.updateDeliveryAddress = true;
        $scope.enableFieldAD = "field-enable";
        var clientOriginalCopy = {
          country: $scope.client.deliveryAddress.country,
          department: $scope.client.deliveryAddress.department,
          city: $scope.client.deliveryAddress.city,
          neighborhood: $scope.client.deliveryAddress.neighborhood,
          nomenclature: $scope.client.deliveryAddress.nomenclature,
          additionalInformation: $scope.client.deliveryAddress.additionalInformation,
        };
        $scope.clientOriginalCopyDA = clientOriginalCopy;
      }

      // Cancel the action of edit delivery address before the data is saved.
      $scope.cancelUpdateDeliveryAddress = function () {
        $scope.client.deliveryAddress.country = $scope.clientOriginalCopyDA.country;
        $scope.client.deliveryAddress.department = $scope.clientOriginalCopyDA.department;
        $scope.client.deliveryAddress.city = $scope.clientOriginalCopyDA.city;
        $scope.client.deliveryAddress.neighborhood = $scope.clientOriginalCopyDA.neighborhood;
        $scope.client.deliveryAddress.nomenclature = $scope.clientOriginalCopyDA.nomenclature;
        $scope.client.deliveryAddress.additionalInformation = $scope.clientOriginalCopyDA.additionalInformation;
        $scope.updateDeliveryAddress = false;
        $scope.enableFieldAD = "";
      }

      // Create the params to realize the request to edit of delivery address.
      $scope.saveNewDeliveryAddress = function () {
        var country = $scope.client.deliveryAddress.country;
        var department = $scope.client.deliveryAddress.department;
        var city = $scope.client.deliveryAddress.city;
        var neighborhood = $scope.client.deliveryAddress.neighborhood;
        var nomenclature = $scope.client.deliveryAddress.nomenclature;
        var additionalInformation = $scope.client.deliveryAddress.additionalInformation;

        if (!country) {
          $scope.infoMsgOptionsAD.message = 'Debe ingresar el país.';
          $scope.infoMsgOptionsAD.showMessage = true;
          return;
        }
        if (!department) {
          $scope.infoMsgOptionsAD.message = 'Debe ingresar el departamento.';
          $scope.infoMsgOptionsAD.showMessage = true;
          return;
        }
        if (!city) {
          $scope.infoMsgOptionsAD.message = 'Debe ingresar la ciudad.';
          $scope.infoMsgOptionsAD.showMessage = true;
          return;
        }
        if (!neighborhood) {
          $scope.infoMsgOptionsAD.message = 'Debe ingresar el barrio.';
          $scope.infoMsgOptionsAD.showMessage = true;
          return;
        }

        if (!nomenclature) {
          $scope.infoMsgOptionsAD.message = 'Debe ingresar la nomenclatura.';
          $scope.infoMsgOptionsAD.showMessage = true;
          return;
        }

        var addressCredentials = {
          deliveryCountry: country,
          deliveryDepartment: department,
          deliveryCity: city,
          deliveryNeighborhood: neighborhood,
          deliveryNomenclature: nomenclature,
          deliveryAdditionalInformation: additionalInformation,
          clientId: $scope.client.id
        }

        ClientSvc.updateDeliveryAddressAdmin(addressCredentials)
          .then(function(res) {
            showMessageSuccessAD('Dirección actualizada.');
            $scope.updateDeliveryAddress = false;
            $scope.enableFieldAD = "";
          })
          .catch(function(err) {
            $scope.infoMsgOptionsGI.message = 'No se ha podido actualizar la dirección.';
            $scope.infoMsgOptionsGI.showMessage = true;
          })
      }

      // Show the success message after save of delivery address.
      function showMessageSuccessAD(message) {
        $scope.infoMsgOptionsAD.type = 'success';
        $scope.infoMsgOptionsAD.message = message;
        $scope.infoMsgOptionsAD.showMessage = true;
        setTimeout(function () {
          $scope.infoMsgOptionsAD.type = 'error';
          $scope.infoMsgOptionsAD.showMessage = false;
        }, 2000);
      }

    }
  ]);
