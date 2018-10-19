var fournee = angular.module('fournee');

  fournee.directive('itemCard', function () {
    return {
      restric: 'E',
      templateUrl: 'templates/private/shared/item-card.html',
      scope : {
        item: '=',
        selectedItem: '=',
        control: '=',
        showHidden: '=?'
      },
      controller: 'itemCard',
    }
  })

  fournee.controller('itemCard', ['$scope', '$log', 'productItemSvc', '$ngConfirm', 'orderByFilter', '$state',
   function($scope, $log, productItemSvc, $ngConfirm, orderBy, $state) {
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
        if (err.data.code == 460) {
          $ngConfirm(err.data.msg)
        }
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

    // Function to delete item selected.
    deleteElement = function(){
      var elementParam = {
        elementId: $scope.item.id
      }
      
      productItemSvc.deleteElement(elementParam)
      .then(function (res) {
        console.log("Data response: ", res.data);
        $scope.showHidden = false;
      })
      .catch(function (err) {
        $ngConfirm("Error al eliminar el elemento");
      });
    }

    $scope.confirmDeleteElement = function(){
      $ngConfirm({
        title: '¿Está seguro que desea eliminar el elemento?',
        useBootstrap: true,
        content: 'Se desabilitará el elemento permanentemente.',
        buttons: {
          deleteReceptionHour: {
            text: 'Eliminar',
            btnClass: 'btn-red',
            action: function() {
              deleteElement();
            }
          },
          cancel: function() {
            
          }
        }
      });
    }

    $scope.confirmDeleteItem = function($event, item, index, items){
      console.log("Items ", items);
      console.log("Item id", item);
      console.log("Index", index);
      console.log("Indice del item a remover indexof: ", items.indexOf(item));
      $event.stopPropagation();
      $ngConfirm({
        title: '¿Está seguro que desea eliminar el item?',
        useBootstrap: true,
        content: 'Se desabilitará el item permanentemente.',
        buttons: {
          deleteReceptionHour: {
            text: 'Eliminar',
            btnClass: 'btn-red',
            action: function() {
              disableItem(item, index, items);
            }
          },
          cancel: function() {
            
          }
        }
      });
    }

    // Función que llama el servicio para desabilitar un item.
    disableItem = function(item, indexItem, items){
      // Parametros del servicio para desabilitar item
      var disableItemParam = {
        itemId: item.id
      }
      
      // Llamado al servicio para desabilitar un item.
      productItemSvc.disableItem(disableItemParam)
      .then(function (res) {
        $ngConfirm("Item removido");
        items.splice(items.indexOf(item), 1);
        $state.reload();
      })
      .catch(function (err) {
        console.log(err);
        $ngConfirm("Error al eliminar el item");
      });
    }

  }]);
