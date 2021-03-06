(function() {
  var fournee = angular.module('fournee');

  fournee.controller('ProductUpdateCtrl', ['$scope', '$log', '$timeout', '$state', '$ngConfirm', 'productSvc', 'productItemSvc',
    function($scope, $log, $timeout, $state, $ngConfirm, productSvc, productItemSvc) {
      $scope.selecting = true;
      $scope.selectedProduct = {};
      $scope.selectedElement = null;
      $scope.percentageInput = {};
      var currentElement = $scope.selectedElement;

      $scope.changePriceOptionsArray = [{
        text: "Seleccionar opción",
        code: 1
      }, {
        text: "Subir precio",
        code: 2
      }, {
        text: "Bajar precio",
        code: 3
      }]
      $scope.changePriceOptions = {
        choices: $scope.changePriceOptionsArray,
        selected: $scope.changePriceOptionsArray[0]
      }
      var percentagesArray = [5, 10, 15, 20, 25, 30, 'Otro'];
      $scope.percentages = {
        choices: percentagesArray,
        selected: percentagesArray[0]
      }

      $scope.verifyPercentage = function() {
        if ($scope.percentages.selected === 'Otro') {
          $scope.showInputPercentage = true;
          return;
        }
        $scope.showInputPercentage = false;
        $scope.percentageInput.value = "";
      }

      $scope.showConfirmChangePrice = function() {
        var changeType = null;
        var optionCode = $scope.changePriceOptions.selected.code;
        var percentage = $scope.showInputPercentage ? $scope.percentageInput.value : $scope.percentages.selected;
        if (optionCode === 1) {
          return;
        }
        if (!percentage) {
          $ngConfirm('Ingrese un porcentaje.');
          $scope.changePriceOptions.selected = $scope.changePriceOptionsArray[0];
          return;
        }
        if (optionCode === 2) {
          changeType = 'subir';
        } else if (optionCode === 3) {
          changeType = 'bajar';
        }
        $ngConfirm({
          title: 'Confirmación',
          content: '¿Desea ' + changeType + ' ' + percentage + '% los precios de todos los productos asignados a los clientes?',
          onClose: function() {
            $scope.changePriceOptions.selected = $scope.changePriceOptionsArray[0];
          },
          buttons: {
            cancel: {
              text: 'Cancelar',
              btnClass: 'btn-danger',
              action: function(scope, button) {

              }
            },
            accept: {
              text: 'Confirmar',
              btnClass: 'btn-sienna',
              action: function(scope, button) {
                productSvc.updateAllPrices({
                    changeType: optionCode,
                    percentage: percentage
                  })
                  .then((res) => {
                    console.log(res.data);
                    $ngConfirm('Se actualizarón correctamente');
                    $scope.percentageInput.value = "";
                  })
                  .catch((err) => {
                    console.log(err);
                  })
              }
            }
          }
        })
        // productSvc.getClientsProducts()
        // .then((clientsProducts) => {
        //   console.log(clientsProducts);
        // })
        // .catch((err) => {
        //   console.log(err);
        // })
      }

      productSvc.getProducts()
        .then(function(res) {
          $scope.products = res.data;
        })
        .catch(function(err) {
          $log.log(err);
        });


      productItemSvc.getProductPriority()
        .then(function(res) {
          $scope.priorities = res.data;
          $scope.elements = [];

          // Lets create the item array with mandatory elements firts.
          $scope.priorities.mandatory.forEach(function(element, i, elements) {
            $scope.elements.push('&' + element.toUpperCase().trim() + '&');
          });
          return productItemSvc.getAll();
        })
        .then(function(res) {
          // Lets sort elements in mandatory order, then in created order.
          data = res.data
          data.forEach(function(element, i, elements) {
            index = $scope.elements.indexOf('&' + element.name.toUpperCase().trim() + '&');
            if (index == -1) {
              $scope.elements.push(element);
            } else {
              $scope.elements[index] = element;
            }
          });
        })
        .catch(function(err) {
          $log.log(err);
        });


      $scope.formatNumber = function() {
        console.log($scope.selectedProduct.price);
        if (!$scope.selectedProduct.price) {
          return;
        }
        var number = $scope.selectedProduct.price.replace(/\D/g, '');
        console.log("number begin " + number);
        var numberLength = number.length
        if (numberLength > 3) {
          var n = Math.trunc(numberLength / 3);
          console.log(n);
          for (var i = 1; i <= n; i++) {
            var arrNumber = number.split("");
            var index = (numberLength - (3 * i));
            if (index != 0) {
              arrNumber.splice(index, 0, '.');
            }
            number = arrNumber.join("");
          }
        }
        console.log(number);
        $scope.selectedProduct.price = number;
      }

      $scope.updateProduct = function() {
        var credentials = {
          productCode: $scope.selectedProduct.code,
          // price: $scope.selectedProduct.price.replace(/\D/g,''),
          unitsPack: $scope.selectedProduct.unitsPack,
        }
        var items = [];

        $scope.elements.forEach(function(element, index, elements) {
          if (element.selectedItem) {
            element.selectedItem.name = element.name;
            items.push(element.selectedItem);
          }
        });

        credentials.items = items;

        productSvc.updateProduct(credentials)
          .then(function(res) {
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
          .catch(function(err) {
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
      $scope.selectProduct = function(product) {
        $scope.selecting = false;
        $scope.selectedProduct.code = product.code;
        $scope.selectedProduct.name = product.name;
        $scope.selectedProduct.shortName = product.shortName;
        $scope.selectedProduct.price = product.price;
        $scope.selectedProduct.unitsPack = product.unitsPack;

        var element = null;
        var item = null;
        var itemTypeName = '';
        var elementName = '';

        // First iterate over the item components of the product.
        product.items.forEach(function(productItem, index, productItems) {
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
      $scope.selectElement = function(element) {
        $scope.selectingElement = true;
        if ($scope.selectedElement && element !== $scope.selectedElement) {
          $scope.selectedElement.selected = false;
        }

        $scope.selectedElement = element;
        currentElement = $scope.selectedElement;
        currentElement.selected = true;

        $timeout(function() {
          $scope.selectingElement = false;
        }, 500);
      }

      // Function to select an item of a selected category
      $scope.selectItem = function(item) {
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
      $scope.exit = function() {
        $state.reload();
      }

      $scope.reset = function() {
        $state.reload();
      }

      // Function to create the name and shortName of the product with the selected items.
      var makeProduct = function() {
        var name = '';
        var shortName = '';

        $scope.priorities.order.forEach(function(element, i, elements) {
          name = name + '&' + element.toUpperCase().trim() + '&';
          shortName = shortName + '&' + element.toUpperCase().trim() + '&';
        });

        $scope.elements.forEach(function(element, i, elements) {
          if (element.selectedItem) {
            name = name.replace('&' + element.name.toUpperCase().trim() + '&', element.selectedItem.value + ' ');
            shortName = shortName.replace('&' + element.name.toUpperCase().trim() + '&', element.selectedItem.shortValue + ' ');
          }
        });

        $scope.priorities.order.forEach(function(element, i, elements) {
          name = name.replace('&' + element.toUpperCase().trim() + '&', '');
          shortName = shortName.replace('&' + element.toUpperCase().trim() + '&', '');
        });

        $scope.selectedProduct.name = name.trim();
        $scope.selectedProduct.shortName = shortName.trim();
      }

    }
  ]);
})();
