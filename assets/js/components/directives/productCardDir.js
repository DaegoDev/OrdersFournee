(function() {
  var fournee = angular.module('fournee');

  fournee.directive('productCard', function() {
    return {
      restric: 'E',
      templateUrl: 'templates/private/shared/product-card.html',
      scope: {
        product: '=',
        type: '@',
        selectList: '=?',
        control: '=?'
      },
      controller: 'productCardCtrl',
    }
  })

  fournee.controller('productCardCtrl', ['$scope', '$log', productCardCtrl]);

  function productCardCtrl($scope, $log) {
    // Control variables to manage the behaviour of the directive base on the type value.
    $scope.dirControl = null;
    $scope.clientProduct = null;
    $scope.name = '';

    // Tooltip popover options
    $scope.tooltip = {
      content: "",
      templateUrl: '/templates/private/shared/product-card-tooltip.html',
      tittle: 'Elementos'
    }

    // Control variables to manage the two type of order products (raw or baked).
    $scope.baked = "";
    $scope.amount = 0;
    var rawProduct = null;
    var bakedProduct = null;

    if (!$scope.control) {
      $scope.control = {};
    }
    $scope.dirControl = $scope.control;

    // Check which type of directive is used, then set the corresponding values.
    if ($scope.type == 'orderProduct') {

      $scope.dirProduct = $scope.product.product;
      $scope.clientProduct = {
        clientId: $scope.clientId,
        clientProductId: $scope.id
      }
      if ($scope.product.customName) {
        $scope.name = $scope.product.customName;
      } else {
        $scope.name = $scope.dirProduct.shortName;
      }
    } else if ($scope.type == 'select') {
      $scope.class = ['select'];
      $scope.dirProduct = $scope.product;
      $scope.name = $scope.product.shortName;
    } else if ($scope.type == 'list') {
      $scope.class = ['list'];
      $scope.dirProduct = $scope.product;
      $scope.name = $scope.product.shortName;
    }

    $scope.toggleCollapse = function() {
      $scope.collapsed = !$scope.collapsed;
    }

    // API functions exposed.
    // Function to get the current amount of items.
    $scope.dirControl.getAmount = function() {
      return $scope.amount;
    }

    // Function to get the current type of product (Baked = true, Raw = false).
    $scope.dirControl.getBaked = function() {
      return $scope.baked;
    }

    // Function to get the configured product with name, amount and type.
    $scope.dirControl.getProduct = function() {
      return buildProduct();
    }

    $scope.dirControl.selectProduct = function () {
      return $scope.product;
    }

    // function to remove a product saved in the selectList.
    $scope.dirControl.removeProduct = function(product) {
      var index = $scope.selectList.indexOf(product);
      if (index != -1) {
        $scope.selectList.splice(index, 1);
      }
      if (rawProduct == product) {
        rawProduct = null;
      } else if (bakedProduct == product) {
        bakedProduct = null;
      }
    }

    // Function to reset directive to default values
    $scope.dirControl.reset = function() {
      $scope.baked = false;
      $scope.amount = 0;
      rawProduct = null;
      bakedProduct = null;
    }

    // Function to add a product to the list passed as attribute.
    $scope.addProductToList = function() {
      var product = buildProduct();
      if (product) {
        var index = $scope.selectList.indexOf(product);
        if (index == -1) {
          $scope.selectList.push(product);
        }
      }
    }

    // Function to build current product selected.
    function buildProduct() {
      var currentProduct = null;
      if ($scope.amount == 0) {
        return;
      }

      if ($scope.state == 'frozen' && !rawProduct) {
        rawProduct = {
          client_product: $scope.product.id,
          name: $scope.name,
          amount: 0,
          baked: false
        }
      } else if ($scope.state == 'baked' && !bakedProduct) {
        bakedProduct = {
          client_product: $scope.product.id,
          name: $scope.name,
          amount: 0,
          baked: true
        }
      } else if (!$scope.state) {
        return;
      }

      if ($scope.state == 'baked') {
        currentProduct = bakedProduct;
      } else if ($scope.state == 'frozen') {
        currentProduct = rawProduct;
      }
      currentProduct.amount += $scope.amount;
      return currentProduct;
    }

    $scope.getTitleColor = function(product) {
      var dough = null
      var colorHash = new ColorHash({lightness: [0.35, 0.3, 0.25]});
      product.items.forEach(function(item, i, items) {
        if (item.elementName.toLowerCase() == "masa") {
          dough = item.value;
        }
      });
      return {'background-color': colorHash.hex(dough)}
    }

  }
}())
