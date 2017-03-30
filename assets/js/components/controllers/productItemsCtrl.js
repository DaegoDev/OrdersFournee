(function() {
  var fournee = angular.module('fournee');
  fournee.controller('productItemsCtrl', ['$scope', '$log', 'productItemSvc', productItemsCtrl]);

  function productItemsCtrl($scope, $log, productItemSvc) {
    productItemSvc.getByName('masa')
      .then(function(res) {
        // $scope.test = res.data;
      });

    productItemSvc.getAll()
      .then(function(res) {
        $scope.test = res.data
      });

    $scope.items = [{
        name: 'Masa',
        values: {
          item1: 'alemán',
          item2: 'Baguette',
          item3: 'Brioche',
        }
      },
      {
        name: 'Forma',
        values: {
          item1: 'Barra',
          item2: 'Rect',
          item3: 'Disco',
        }
      }
    ];

  }

}())
