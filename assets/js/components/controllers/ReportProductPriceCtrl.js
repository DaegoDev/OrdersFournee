var arketops = angular.module('fournee');
arketops.controller('ReportProductPriceCtrl', ['$scope', '$log', '$ngConfirm', '$state',
  'productSvc',
  function($scope, $log, $ngConfirm, $state, productSvc) {

    $scope.products = [];

    productSvc.getMinMaxPrices()
    .then((res) => {
      $scope.products = res.data;
    })


  }
]);
