(function () {
  var fournee = angular.module('fournee');

  fournee.controller('AnnouncementListCtrl', ['$scope', '$log', '$state', '$ngConfirm', 'AnnouncementSvc', '$sce',
  function ($scope, $log, $state, $ngConfirm, AnnouncementSvc, $sce) {

    $scope.loadAnnouncements = function () {
      AnnouncementSvc.getAll()
      .then(function (res) {
        $scope.announcements = res.data;
      })
      .catch(function (err) {
        $log.log(err);
      });
    }
    $scope.loadAnnouncements();

    $scope.selectAnnouncement = function (announcement) {
      $state.go('announcement.create', {announcement: announcement, mode: 'UPDATE'});
    }

    $scope.deleteAnnouncement = function (announcement) {
      $ngConfirm({
        title: 'Eliminar anuncio.',
        useBootstrap: true,
        content: '¿Está seguro que desea eliminar el anuncio?',
        type: 'red',
        columnClass: 'small',
        backgroundDismiss: true,
        buttons: {
          confirm: {
            text: 'Confirmar',
            btnClass: 'btn-sienna',
            action: function () {
              AnnouncementSvc.delete(announcement)
              .then(function (res) {
                $scope.announcements.splice($scope.announcements.indexOf(announcement), 1);
              })
              .catch(function (err) {
                $ngConfirm("El anuncio no ha sido eliminado, intente nuevamente.");
                $log.log(err);
              });
              return true;
            }
          },
          exit: {
            text: 'Salir',
            btnClass: 'btn-sienna',
            action: function() {
              return true;
            }
          }
        }
      });
    }


  }]);
})();
