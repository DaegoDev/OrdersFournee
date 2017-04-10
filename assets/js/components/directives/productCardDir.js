(function(){
  var fournee = angular.module('fournee');

  fournee.directive('productCard', function () {
    return {
      restric: 'E',
      templateUrl: 'templates/private/shared/product-card.html',
      scope : {
        product: '=',
        options: '=?',
        selectArray: '=?'
      },
      controller: 'productCardCtrl'
    }
  })

  fournee.controller('productCardCtrl', ['$scope', '$log', productCardCtrl]);

  function productCardCtrl($scope, $log) {

  }
}())
