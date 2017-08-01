(function () {
  var fournee = angular.module('fournee');

  fournee.controller('ProductProductionCtrl', ['$scope', '$log', 'OrderService',
  function ($scope, $log, OrderService) {
    var date = null;

    $scope.datePicker = {
      date: new Date(),
      opened: false,
      format: 'dd-MMMM-yyyy',
      options: {
        dateDisabled: function (data) {
          var date = data.date;
          var mode = data.mode;
          return mode === 'day' && (date.getDay() === 0);
        },
        startingDay: 1
      }
    };

    date = $scope.datePicker.date;
    date.setDate(date.getDate() + 1);

    $scope.search = {
      shortName: '',
      state: {
        0: true,
        1: true,
      }
    }

    $scope.getProducts = function () {
      OrderService.getProductionAfterDate(
        {
          timestamp: $scope.datePicker.date.getTime(),
          offset: (-1) * $scope.datePicker.date.getTimezoneOffset()
        })
        .then(function (res) {
          $log.log(res.data);
          $scope.products = res.data;
        })
        .catch(function (err) {
          $log.log(err);
        });
      }

    $scope.getProducts();

    $scope.openDatePicker = function () {
      $scope.datePicker.opened = true;
    };

    $scope.stateFilter = function (product) {
      for (var i = 0; i < Object.keys($scope.search.state).length; i++) {
        if (product.state == i) {
          return $scope.search.state[i];
        }
      }
    };

    $scope.sortBy = function (property) {
      $scope.sortProperty = property;
      $scope.sortReversed = ($scope.sortProperty === property) ? !$scope.sortReversed : false;
    }

  }])
})();
