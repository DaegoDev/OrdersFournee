(function () {
  var fournee = angular.module('fournee');
  fournee.controller('clientCreateCtrl',
    ['$scope', '$log', 'productSvc', 'SignupService', clientCreateCtrl]);

  function clientCreateCtrl($scope, $log, productSvc, SignupService) {
    $scope.client = {};
    $scope.productCodes = [];
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
      var clientCredentials = {
        legalName: $scope.client.legalName,
        nit: $scope.client.nit,
        tradeName: $scope.client.tradeName,
        managerName: $scope.client.managerName,
        managerPhonenumber: $scope.client.managerPhonenumber,
        businessPhonenumber: $scope.client.businessPhonenumber,
        clientAdditionalInformation: $scope.client.additionalInformation,
        productCodes: $scope.productCodes
      }

      SignupService.signupClient(clientCredentials)
        .then(function(res) {
          console.log(res);
        });
    }
  }

}())
