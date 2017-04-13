(function() {
  var fournee = angular.module('fournee');
  fournee.controller('OrderCtrl', ['$scope', '$log','$state','ClientSvc', orderCtrl]);

  function orderCtrl($scope, $log, $state, ClientSvc) {
    ClientSvc.validateInformation()
    .then(function(res) {
      var isCompletedInformation = res.data;
      if(isCompletedInformation){
        $state.go('order.create.shoppingCart');
      }else {
        $state.go('home');
      }
    })

  }
}())
