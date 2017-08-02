var fournee = angular.module('fournee');
fournee.controller('OrderCtrl', ['$scope', '$log', '$state', 'ClientSvc', '$ngConfirm', function($scope, $log, $state, ClientSvc, $ngConfirm) {
  if ($state.current.name != "order.myList") {
  console.log($state.current.name);
    ClientSvc.validateInformation()
    .then(function(res) {
      var isCompletedInformation = res.data;
      if (isCompletedInformation) {
        $state.go('order.create.shoppingCart');
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
}]);
