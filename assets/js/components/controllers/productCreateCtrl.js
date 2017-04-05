(function() {
    var fournee = angular.module('fournee');
    fournee.controller('productCreateCtrl', ['$scope', '$log', 'productItemSvc','productSvc', productCreateCtrl]);

    function productCreateCtrl($scope, $log, productItemSvc, productSvc) {
      $scope.product = {};
      $scope.selectedItems = {};

      $scope.createProduct = function () {
        var items = [];
        for (var i in $scope.selectedItems) {
          items.push($scope.selectedItems[i])
        }
        productSvc.createProduct({items: items})
          .then(function (res) {
            $log.warn(res.data);
          })
          .catch(function (err) {
            $log.info(err);
          });
      }

      $scope.createElement = function () {
        productItemSvc.createElement({name: $scope.elementName})
        .then(function(res) {
          $scope.items.push(res.data)
          $log.warn($scope.items)
        })
        .catch(function(err) {

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
    productItemSvc.getAll()
      .then(function(res) {
        $scope.items = res.data
      });
  }
}())
