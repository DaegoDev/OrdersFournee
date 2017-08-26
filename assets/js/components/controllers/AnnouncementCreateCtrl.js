(function () {
  var fournee = angular.module('fournee');

  fournee.controller('AnnouncementCreateCtrl', ['$scope', '$log', '$stateParams', '$state', '$ngConfirm', 'AnnouncementSvc',
  function ($scope, $log, $stateParams, $state, $ngConfirm, AnnouncementSvc) {
    $scope.mode = 'CREATE';
    $scope.announcement = {};

    if ($stateParams.announcement) {
      $scope.mode = $stateParams.mode;
      $scope.announcement = $stateParams.announcement;
    }

    $scope.infoMsgOptions = {
      showMessage: false,
      message: '',
      type: 'error',
      title: ''
    }

    $scope.options = {
      lang: 'es-ES',

      height: 400,
      width: null,
      minHeight: null,
      maxHeight: null,

      focus: true,
      styleWithSpan: true,
      defaultFontName: 'Arial',

      dialogsFade: true,  // Add fade effect on dialogs
      dialogsInBody: true,
      disableLinkTarget: false,
      disableDragAndDrop: false,
      disableResizeEditor: true,

      toolbar: [
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['font', ['bold', 'italic', 'underline', 'color']],
        ['para', ['paragraph', 'ol', 'ul',  'height']],
        ['insert', ['table', 'picture', 'video', 'link']]
      ],

      fontSizes: ['8', '9', '10', '11', '12', '16', '18', '24', '36', '42', '60', '72'],
      fontNames: [
        'Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
        'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande',
        'Lucida Sans', 'Tahoma', 'Times', 'Times New Roman', 'Verdana'
      ],
    };


    $scope.create = function () {
      if ($scope.mode !== 'CREATE') {
        return;
      }

      if (!$scope.announcement.title) {
        $scope.infoMsgOptions.message = 'Debe ingresar un titulo al anuncio que desea crear.';
        $scope.infoMsgOptions.showMessage = true;
        return;
      }

      if (!$scope.announcement.content) {
        $scope.infoMsgOptions.message = 'El contenido del anuncio no puede estár vacido.';
        $scope.infoMsgOptions.showMessage = true;
        return;
      }

      AnnouncementSvc.create($scope.announcement)
      .then(function (res) {
        $scope.infoMsgOptions.showMessage = false;
        showCreatedSuccess();
      })
      .catch(function (err) {
        showError();
        $log.log(err);
      });
    }

    $scope.update = function () {
      if ($scope.mode !== 'UPDATE') {
        return;
      }

      AnnouncementSvc.update($scope.announcement)
      .then(function (res) {
        showUpdatedSuccess();
      })
      .catch(function (err) {
        showError();
        $log.log(err);
      });
    }

    $scope.exit = function () {
      $state.go('announcement.list');
    }

    $scope.showPreview = function () {
      $state.go('announcementPreview', {announcement: $scope.announcement, mode: $scope.mode});
    }

    function showCreatedSuccess () {
      $ngConfirm({
        title: 'Anuncio guardado.',
        useBootstrap: true,
        type: 'green',
        content: 'El anuncio ha sido creado con éxito.',
        buttons: {
          new: {
            text: 'Nuevo anuncio',
            btnClass: 'btn-sienna',
            action: function() {
              $state.reload();
            }
          },
          exit: {
            text: 'Salir',
            btnClass: 'btn-sienna',
            action: function() {
              $state.go('announcement.list');
            }
          }
        }
      });
    }

    function showUpdatedSuccess () {
      $ngConfirm({
        title: 'Anuncio actualizado.',
        useBootstrap: true,
        type: 'green',
        content: 'El anuncio a sido actualizado con éxito.',
        buttons: {
          exit: {
            text: 'Salir',
            btnClass: 'btn-sienna',
            action: function() {
              $state.go('announcement.list');
            }
          }
        }
      });
    }

    function showError () {
      $ngConfirm({
        title: 'Error.',
        type: 'red',
        backgroundDismiss: true,
        columnClass: 'small',
        useBootstrap: true,
        content: 'Ha ocurrido un error, porfavor intente nuevamente.',
        buttons: {
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
