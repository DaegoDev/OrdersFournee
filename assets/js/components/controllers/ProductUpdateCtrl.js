(function () {
  var fournee = angular.module('fournee');

  fournee.controller('ProductUpdateCtrl', ['$scope','$log', '$timeout', '$state', '$ngConfirm', 'productSvc', 'productItemSvc',
  function ($scope, $log, $timeout, $state, $ngConfirm, productSvc, productItemSvc) {
    $scope.selecting = true;
    $scope.selectedProduct = {};
    $scope.selectedElement = null;
    var currentElement = $scope.selectedElement;


    productSvc.getProducts()
    .then(function (res) {
      $scope.products = res.data;
    })
    .catch(function (err) {
      $log.log(err);
    });


    productItemSvc.getProductPriority()
    .then(function (res) {
      $scope.priorities = res.data;
      $scope.elements = [];

      // Lets create the item array with mandatory elements firts.
      $scope.priorities.mandatory.forEach(function (element, i, elements) {
        $scope.elements.push('&'+element.toUpperCase().trim()+'&');
      });
      return productItemSvc.getAll();
    })
    .then(function (res) {
      // Lets sort elements in mandatory order, then in created order.
      data = res.data
      data.forEach(function (element, i, elements) {
        index = $scope.elements.indexOf('&'+element.name.toUpperCase().trim()+'&');
        if (index == -1) {
          $scope.elements.push(element);
        } else {
          $scope.elements[index] = element;
        }
      });
    })
    .catch(function (err) {
      $log.log(err);
    });

    $scope.updateProduct = function () {
      var credentials = {
        productCode: $scope.selectedProduct.code
      }
      var items = [];

      $scope.elements.forEach(function (element, index, elements) {
        if (element.selectedItem) {
          element.selectedItem.name = element.name;
          items.push(element.selectedItem);
        }
      });

      credentials.items = items;

      productSvc.updateProduct(credentials)
      .then(function (res) {
        $ngConfirm({
          title: 'Producto modificado.',
          content: 'El producto ha sido modificado con éxito.',
          type: 'green',
          buttons: {
            new: {
              text: 'Modificar otro',
              btnClass: 'btn-sienna',
              action: function(scope, buttons) {
                $scope.reset();
              }
            },
            exit: {
              text: 'Salir',
              btnClass: 'btn-sienna',
              action: function(scope, buttons) {
                $state.go('product.list')
              }
            }
          }
        });
      })
      .catch(function (err) {
        if (err.data.code && err.data.code == 4) {
          $ngConfirm({
            title: 'Producto no ha sido modificado.',
            content: 'El producto no ha sido modificado ya que la masa no coincide con el producto original.',
            type: 'red',
            buttons: {
              exit: {
                text: 'Salir',
                btnClass: 'btn-sienna',
                action: function(scope, buttons) {
                  return true;
                }
              }
            }
          });
        }
      });
    }

    // Function to select the product that is going to be edited.
    // It also selects the item components of the product.
    $scope.selectProduct = function (product) {
      $scope.selecting = false;
      $scope.selectedProduct.code = product.code;
      $scope.selectedProduct.name = product.name;
      $scope.selectedProduct.shortName = product.shortName;

      var element = null;
      var item = null;
      var itemTypeName = '';
      var elementName = '';

      // First iterate over the item components of the product.
      product.items.forEach(function (productItem, index, productItems) {
        itemTypeName = productItem.elementName.toUpperCase().trim();

        // Then itarete over all existing elements until the type of an item product
        // is the same element in the iteration.
        for (var i in $scope.elements) {
          element = $scope.elements[i];
          elementName = element.name.toUpperCase().trim();
          if (elementName == itemTypeName) {

            // Finally when the element is found, search for the item product inside the
            // element items and check it as selected so it will be display as the current
            // selected item in the item box.
            for (var j in element.items) {
              item = element.items[j];
              if (item.id == productItem.itemId) {
                element.selectedItem = item;
                element.selectedItem.selected = true;
                break;
              }
            }
            break
          }
        }
      });
    }

    // Function to select a element which items will be shown in the item box.
    $scope.selectElement = function (element) {
      $scope.selectingElement = true;
      if ($scope.selectedElement && element !== $scope.selectedElement) {
        $scope.selectedElement.selected = false;
      }

      $scope.selectedElement = element;
      currentElement = $scope.selectedElement;
      currentElement.selected = true;

      $timeout(function () {
        $scope.selectingElement = false;
      }, 500);
    }

    // Function to select an item of a selected category
    $scope.selectItem = function (item) {
      if (currentElement.name.toUpperCase().trim() == 'MASA') {
        $ngConfirm({
          title: 'Acción prohibida.',
          content: 'La masa de un producto no puede ser modificada.',
          backgroundDismiss: true,
          type: 'red',
          buttons: {
            exit: {
              text: 'Salir',
              btnClass: 'btn-sienna',
              action: function(scope, buttons) {
                return true;
              }
            }
          }
        });
        return false;
      }

      // First check if the item clicked is already selected, if so then unckeck the item.
      if (item === currentElement.selectedItem) {
        currentElement.selectedItem.selected = false;
        currentElement.selectedItem = null;
        makeProduct(); // Build the new product name and shortName
        return;
      }

      // If the item selected is different from the current one then unckeck the current item
      // and then ckeck the clicked item.
      if (currentElement.selectedItem) {
        currentElement.selectedItem.selected = false;
      }

      currentElement.selectedItem = item;
      currentElement.selectedItem.selected = true;

      makeProduct(); // Build the new product name and shortName
    }

    // Function to go back to the selecting products menu.
    $scope.exit = function () {
      $state.reload();
    }

    $scope.reset = function () {
      $state.reload();
    }

    // Function to create the name and shortName of the product with the selected items.
    var makeProduct = function () {
      var name = '';
      var shortName = '';

      $scope.priorities.order.forEach(function (element, i, elements) {
        name = name + '&' + element.toUpperCase().trim() + '&';
        shortName = shortName + '&' + element.toUpperCase().trim() + '&';
      });

      $scope.elements.forEach(function (element, i, elements) {
        if (element.selectedItem) {
          name = name.replace('&'+ element.name.toUpperCase().trim()+'&', element.selectedItem.value + ' ');
          shortName = shortName.replace('&'+ element.name.toUpperCase().trim()+'&', element.selectedItem.shortValue +' ');
        }
      });

      $scope.priorities.order.forEach(function (element, i, elements) {
        name = name.replace('&'+element.toUpperCase().trim()+'&', '');
        shortName = shortName.replace('&'+element.toUpperCase().trim()+'&', '');
      });

      $scope.selectedProduct.name = name.trim();
      $scope.selectedProduct.shortName = shortName.trim();
    }

  }]);
})();
