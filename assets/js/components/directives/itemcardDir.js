(function(){
  var fournee = angular.module('fournee');

  fournee.directive('itemCard', function () {
    return {
      restric: 'E',
      templateUrl: 'templates/private/shared/item-card.html',
      scope : {
        item: '=',
        selectedItem: '='
      },
      controller: 'itemCard',
    }
  })

  fournee.controller('itemCard', ['$scope', '$log', 'productItemSvc', itemCard]);
  function itemCard($scope, $log, productItemSvc) {
    $scope.isCollapsed = false;
    var currentSelected = null;

    $scope.createItem = function () {
      var item = {
        elementId: $scope.item.id,
        name: $scope.item.name,
        value: $scope.itemValue,
        shortValue: $scope.itemShortValue
      }
      productItemSvc.createItem(item)
      .then(function (res) {
        $scope.itemValue = '';
        $scope.itemShortValue = '';

        if (!$scope.item.items) {
          $scope.item.items = []
        }
        $scope.item.items.push({
          id: res.data.id,
          value: res.data.value,
          shortValue: res.data.shortValue
        })

      })
      .catch(function (err) {
        $log.warn(err)
      });
    }

    $scope.toggleCollapse = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    }

    $scope.selectItem = function (item) {
      if ($scope.currentItem != item) {
        if ($scope.currentItem) {
          $scope.currentItem.isSelected = false;
        }
        $scope.currentItem = item;
        $scope.currentItem.isSelected = true;

        if (!$scope.selectedItem[$scope.item.name]) {
          $scope.selectedItem[$scope.item.name] = {name: $scope.item.name};
        }

        $scope.selectedItem[$scope.item.name].id = item.id;
        $scope.selectedItem[$scope.item.name].value = item.value;
        $scope.selectedItem[$scope.item.name].shortValue = item.shortValue;
        $scope.isCollapsed = true;

      } else {
        $scope.currentItem.isSelected = false;
        $scope.currentItem = null;
        delete $scope.selectedItem[$scope.item.name];
      }
    }
  }
}())
