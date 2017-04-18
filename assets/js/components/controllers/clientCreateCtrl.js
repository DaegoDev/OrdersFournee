(function() {
  var fournee = angular.module('fournee');
  fournee.controller('clientCreateCtrl', ['$scope', '$log', '$state', 'productSvc', 'SignupService', clientCreateCtrl]);

  function clientCreateCtrl($scope, $log, $state, productSvc, SignupService) {
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

    // Function to validate client information.
    $scope.validateInfo = function () {
      if (!$scope.client.legalName) {
        $scope.infoMsgOptions.message = 'Debe ingresar el nombre de la razón social.'
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
      if (!$scope.client.businessPhonenumber) {
        $scope.infoMsgOptions.message = 'Debe ingresar el número telefonico de la empresa.';
        $scope.infoMsgOptions.showMessage = true;
        return;
      }
      if (!$scope.client.managerName) {
        $scope.infoMsgOptions.message = 'Debe ingresar el nombre del administrador de la empresa.';
        $scope.infoMsgOptions.showMessage = true;
        return;
      }
      if (!$scope.client.managerPhonenumber) {
        $scope.infoMsgOptions.message = 'Debe ingresar el número telefonico del administrador.';
        $scope.infoMsgOptions.showMessage = true;
        return;
      }

      var clientInfo = {
        legalName: $scope.client.legalName,
        nit: $scope.client.nit
      }

      SignupService.validateClient(clientInfo)
        .then(function (res) {
          if (res.data) {
            $scope.infoMsgOptions.message = '';
            $scope.infoMsgOptions.showMessage = false;
            $state.go('client.create.products');
          } else {
            $scope.infoMsgOptions.message = 'El cliente que desea crear ya existe, verifique el nombre de razón social y el NIT ingresado.';
            $scope.infoMsgOptions.showMessage = true;
          }
        })
        .catch(function (err) {
          $scope.infoMsgOptions.message = 'Error, se ha presentado un error interno.';
          $scope.infoMsgOptions.showMessage = true;
        });

    }

    $scope.selectProduct = function(product) {
      var index = $scope.productsSelected.indexOf(product);
      if (index == -1) {
        $scope.productsSelected.push(product);
        product.hide = true;
      }
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
        $scope.productsCodes.push(product.code);
      })

      var clientCredentials = {
        legalName: $scope.client.legalName,
        nit: $scope.client.nit,
        tradeName: $scope.client.tradeName,
        managerName: $scope.client.managerName,
        managerPhonenumber: $scope.client.managerPhonenumber,
        businessPhonenumber: $scope.client.businessPhonenumber,
        clientAdditionalInformation: $scope.client.additionalInformation,
        productCodes: $scope.productsCodes
      }
      $log.info(clientCredentials);
      SignupService.signupClient(clientCredentials)
        .then(function(res) {
          $scope.user = res.data;
          $state.go('client.create.user')
        });
    }

    $scope.createNew = function() {
      $scope.client = {};
      $scope.productsCodes = [];
      $scope.productsSelected = [];
      $scope.user = {};
      $state.go('client.create.info');
    }
  }

}())
