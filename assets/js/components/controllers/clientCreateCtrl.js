var fournee = angular.module('fournee');
fournee.controller('clientCreateCtrl', ['$scope', '$log', '$state', 'productSvc', 'SignupService', '$ngConfirm',
function($scope, $log, $state, productSvc, SignupService, $ngConfirm) {
  $scope.client = {};
  $scope.productsCodes = [];
  $scope.productsSelected = [];

  // Error control variables.
  $scope.infoMsgOptions = {
    showMessage: false,
    message: '',
    type: 'error',
    title: ''
  }

  $scope.infoErrorMsg = '';

  productSvc.getProducts()
    .then(function(res) {
      $scope.products = res.data;
    })
    .catch(function(err) {

    });

  // Function to validate client information.
  $scope.validateInfo = function() {
    if (!$scope.client.legalName) {
      $scope.infoMsgOptions.message = 'Debe ingresar el nombre de la razón social.';
      $scope.infoMsgOptions.showMessage = true;
      return;
    }
    if (!$scope.client.nit) {
      $scope.infoMsgOptions.message = 'Debe ingresar el nit de la empresa.';
      $scope.infoMsgOptions.showMessage = true;
      return;
    }
    if (!$scope.client.tradeName) {
      $scope.infoMsgOptions.message = 'Debe ingresar el nombre de la empresa.';
      $scope.infoMsgOptions.showMessage = true;
      return;
    }
    if (!$scope.client.minOrderPrice) {
      $scope.infoMsgOptions.message = 'Debe ingresar el precio minimo para los pedidos.';
      $scope.infoMsgOptions.showMessage = true;
      return;
    }

    var clientInfo = {
      legalName: $scope.client.legalName,
      nit: $scope.client.nit
    }

    SignupService.validateClient(clientInfo)
      .then(function(res) {
        if (res.data) {
          $scope.infoMsgOptions.message = '';
          $scope.infoMsgOptions.showMessage = false;
          $state.go('client.create.products');
        } else {
          $scope.infoMsgOptions.message = 'El cliente que desea crear ya existe, verifique el nombre de razón social y el NIT ingresado.';
          $scope.infoMsgOptions.showMessage = true;
        }
      })
      .catch(function(err) {
        $scope.infoMsgOptions.message = 'Error, se ha presentado un error interno.';
        $scope.infoMsgOptions.showMessage = true;
      });

  }

  // Function to format the number in input price.
  $scope.formatPrice = function(field, type) {
    if (!field) {
      return;
    }
    var number = field.replace(/\D/g, '');
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
      $scope.newCustomPrice = number;
    }else if (type === 2) {
      $scope.client.minOrderPrice = number;
    }
  }

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
                '.<br> <input type="text" ng-model="newCustomPrice" ng-change="formatPrice(' + "newCustomPrice" + ', 1)" class="form-control"/>' +
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
                    var index = $scope.productsSelected.indexOf(product);
                    if (index == -1) {
                      product.customPrice = $scope.newCustomPrice.replace(/\D/g, '');
                      product.sectionGeneralPrice = false;
                      $scope.productsSelected.push(product);
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
            var index = $scope.productsSelected.indexOf(product);
            if (index == -1) {
              product.sectionGeneralPrice = true;
              $scope.productsSelected.push(product);
              product.hide = true;
            }
          }
        }
      }
    });
    // var index = $scope.productsSelected.indexOf(product);
    // if (index == -1) {
    //   $scope.productsSelected.push(product);
    //   product.hide = true;
    // }
  }

  $scope.unSelectProduct = function(product) {
    var index = $scope.productsSelected.indexOf(product);
    if (index != -1) {
      $scope.productsSelected.splice(index, 1);
      product.hide = false;
    }
  }

  $scope.createClient = function() {
    angular.forEach($scope.productsSelected, function(product, key) {
      $scope.productsCodes.push({product: product.code, custom_price: product.customPrice});
    });

    var clientCredentials = {
      legalName: $scope.client.legalName,
      nit: $scope.client.nit,
      tradeName: $scope.client.tradeName,
      email: $scope.client.email,
      ownerName: $scope.client.ownerName,
      ownerPhonenumber: $scope.client.ownerPhonenumber,
      businessPhonenumber: $scope.client.businessPhonenumber,
      clientAdditionalInformation: $scope.client.additionalInformation,
      minOrderPrice: $scope.client.minOrderPrice.replace(/\D/g, ''),
      productCodes: $scope.productsCodes
    }
    // $log.info(clientCredentials);
    SignupService.signupClient(clientCredentials)
      .then(function(res) {
        $scope.user = res.data;
        $state.go('client.create.user');
        angular.forEach($scope.productsSelected, function(product, key) {
          product.hide = false;
        });
        $scope.productsSelected = [];
      })
      .catch(function (err) {
        console.log(err)
        if(err.data.code && err.data.code == 1) {
          $state.go('client.create.info');
        }
      });
  }

  $scope.createNew = function() {
    $scope.client = {};
    $scope.productsCodes = [];
    $scope.productsSelected = [];
    $scope.user = {};
    $state.go('client.create.info');
  }
}]);
