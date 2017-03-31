(function(){
  var fournee = angular.module('fournee');

  fournee.directive('itemCard', function () {
    return {
      restric: 'E',
      templateUrl: 'templates/private/shared/itemcard.html',
      scope : {
        item: '=',
        itemSelected: '='
      },
      controller: 'itemCard',
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
      .catch(function (err) {

      });
    }

    $scope.selectItem = function (item) {
      $scope.selectedItem = item;
      if (!$scope.itemSelected[$scope.item.name]) {
        $scope.itemSelected[$scope.item.name] = {name: $scope.item.name};
      }
      $scope.itemSelected[$scope.item.name].id = item.id;
      $scope.itemSelected[$scope.item.name].value = item.value;
      $scope.itemSelected[$scope.item.name].shortValue = item.shortValue;
    }
  }
}())
