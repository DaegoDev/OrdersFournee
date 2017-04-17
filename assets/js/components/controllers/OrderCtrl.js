(function() {
  var fournee = angular.module('fournee');
  fournee.controller('OrderCtrl', ['$scope', '$log', '$state', 'ClientSvc', '$ngConfirm', orderCtrl]);

  function orderCtrl($scope, $log, $state, ClientSvc, $ngConfirm) {
    ClientSvc.validateInformation()
      .then(function(res) {
        // console.log(res.data);
        var isCompletedInformation = res.data;
        if (isCompletedInformation) {
          $state.go('.create.shoppingCart');
        } else {
          $ngConfirm({
            title: 'Impedimento encontrado!',
            content: 'Para realizar un pedido debe tener completamente diligenciada la información en su perfil.',
            type: 'red',
            typeAnimated: true,
            buttons: {
              goToProfile: {
                text: 'Ir al perfil',
                btnClass: 'btn-red',
                action: function() {
                  $state.go('clientProfile');
                }
              }
            }
          });
        }
      })

  }
}())
