(function() {
    var fournee = angular.module('fournee');
    fournee.controller('productCreateCtrl', ['$scope', '$log', 'productItemSvc', productCreateCtrl]);

    function productCreateCtrl($scope, $log, productItemSvc) {
      $scope.product = {};
      $scope.itemList = {};

      $scope.$watch('itemList', function functionName(newValue, oldValue, scope) {
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
    productItemSvc.getAll()
      .then(function(res) {
        $scope.items = res.data
      });
  }
}())
