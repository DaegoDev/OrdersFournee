var fournee = angular.module('fournee');

  fournee.directive('itemCard', function () {
    return {
      restric: 'E',
      templateUrl: 'templates/private/shared/item-card.html',
      scope : {
        item: '=',
        selectedItem: '=',
        control: '='
      },
      controller: 'itemCard',
    }
  })

  fournee.controller('itemCard', ['$scope', '$log', 'productItemSvc',function($scope, $log, productItemSvc) {
    $scope.currentItem = null;
    $scope.isCollapsed = false;
    $scope.dirControl = null;

    // If item is not an object return;
    if ( typeof $scope.item == 'string') {
      return;
    }

    if (!$scope.control) {
      $scope.control = {}
    }
    $scope.dirControl = $scope.control;

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
      var index = -1;
      item.name = $scope.item.name;
      if ($scope.currentItem != item) {
        if ($scope.currentItem) {
          $scope.currentItem.isSelected = false;
          index = $scope.selectedItem.indexOf($scope.currentItem);
          $scope.selectedItem.splice(index,1);
        }
        $scope.currentItem = item;
        $scope.currentItem.isSelected = true;
        $scope.selectedItem.push(item);
        $scope.isCollapsed = true;

      } else {
        $scope.currentItem.isSelected = false;
        index = $scope.selectedItem.indexOf($scope.currentItem);
        $scope.selectedItem.splice(index,1);
        $scope.currentItem = null;
      }
    }

    // API functions of directive exposed.
    // function to reset directive to default.
    $scope.dirControl.reset = function () {
      if ($scope.currentItem) {
        var index = $scope.selectedItem.indexOf($scope.currentItem);
        if (index != -1) {
          $scope.selectedItem.splice(index,1);
        }
        $scope.currentItem.isSelected = false;
      }
      $scope.currentItem = null;
      $scope.isCollapsed = false;
    }
    // Function to get current item.
    $scope.dirControl.getCurrentItem = function () {
      return $scope.currentItem;
    }
  }]);
