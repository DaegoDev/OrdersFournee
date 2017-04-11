(function () {
  var fournee = angular.module('fournee');
  fournee.controller('clientCreateCtrl',
    ['$scope', '$log', '$state', 'productSvc', 'SignupService', clientCreateCtrl]);

  function clientCreateCtrl($scope, $log, $state, productSvc, SignupService) {
    $scope.client = {};
    $scope.productsCodes = [];
    $scope.productsSelected = [];

    productSvc.getProducts()
      .then(function (res) {
        $scope.products = res.data;
      })

    $scope.selectProduct = function(product) {
      var index = $scope.productsSelected.indexOf(product);
      if (index == -1) {
        $scope.productsSelected.push(product);
        product.hide = true;
      }
    }

    $scope.unSelectProduct = function (product) {
      var index = $scope.productsSelected.indexOf(product);
      if (index != -1) {
        $scope.productsSelected.splice(index,1);
        product.hide = false;
      }
    }

    $scope.createClient = function () {
      angular.forEach($scope.productsSelected, function (product, key) {
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

      SignupService.signupClient(clientCredentials)
        .then(function(res) {
          $scope.user = res.data;
          $state.go('client.create.user')
        });
    }

    $scope.createNew = function () {
      $scope.client = {};
      $scope.productsCodes = [];
      $scope.productsSelected = [];
      $scope.user = {};
      $state.go('client.create.info');
    }
  }

}())
