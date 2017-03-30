(function(){
  var fournee = angular.module('fournee');

  fournee.directive('itemCard', function () {
    return {
      restric: 'E',
      require: '^sidebar',
      templateUrl: 'templates/private/shared/itemcard.html',
      scope : {item: '='},
      controller: 'itemCard'
    }
  })

  fournee.controller('itemCard', ['$scope', '$log', 'productItemSvc', itemCard]);
  function itemCard($scope, $log, productItemSvc) {
    $scope.createItem = function () {
      var item = {
        name: $scope.item.name,
        value: $scope.itemValue,
        shortValue: $scope.itemShortValue
      }
      productItemSvc.create(item)
      .then(function (res) {
        $scope.itemValue = '';
        $scope.itemShortValue = '';
        $scope.item.values.push({
          id: res.data.id,
          value: res.data.value,
          shortValue: res.data.shortValue
        })
      })
      .catch(function () {

      });
    }
  }
}())
