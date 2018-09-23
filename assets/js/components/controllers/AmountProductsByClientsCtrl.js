var arketops = angular.module('fournee');
arketops.controller('AmountProductsByClientsCtrl', ['$scope', '$log', '$ngConfirm', '$state',
  'productSvc',
  function($scope, $log, $ngConfirm, $state, productSvc) {

    //Filters values
    $scope.filters = {};
    //Datepicker variables
    $scope.filters.initialDate = new Date();
    $scope.filters.finalDate = new Date();
    // clients products values
    // $scope.clientsProducts = [];

    /**
     * Datepicker configuration to initialDate.
     */
    $scope.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      startingDay: 1
    };

    $scope.openInitialDatePicker = function() {
      $scope.popupInitialDate.opened = true;
    };

    $scope.popupInitialDate = {
      opened: false
    };

    /**
     * Datepicker configuration to final Date.
     */
    $scope.dateOptionsFinalDate = {
      dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      startingDay: 1,
      minDate: $scope.filters.initialDate
    };

    $scope.openFinalDatePicker = function() {
      $scope.popupFinalDate.opened = true;
    };

    $scope.popupFinalDate = {
      opened: false
    };

    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
        mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.clientsSelected = [];
    $scope.productsSelected = [];
    $scope.clients = [];

    /**
     * Consume service to get clients products
     */
    productSvc.getClientsProducts()
      .then((res) => {
        var response = res.data;
        console.log(res.data);
        for (var productByClient of response.productsByClient) {
          console.log(productByClient);
          if (response.productsByClient.hasOwnProperty(productByClient)) {
            var item = {
              id: productByClient.id,
              label: productByClient.legalName,
            }
            $scope.clients.push(item);
          }
        }

        // $scope.clients = [{
        //   id: 1,
        //   label: "David"
        // }, {
        //   id: 2,
        //   label: "Jhon"
        // }, {
        //   id: 3,
        //   label: "Danny"
        // }];
      })


    $scope.products = [];

    $scope.clientsSettings = {
      enableSearch: true,
      smartButtonMaxItems: 3,
      smartButtonTextConverter: function(itemText, originalItem) {
        if (itemText === 'Jhon') {
          return 'Jhonny!';
        }
        return itemText;
      },
      scrollableHeight: '200px',
      scrollable: true,
      keyboardControls: true,
      styleActive: true
    };

    $scope.productsSettings = {
      enableSearch: true,
      smartButtonMaxItems: 3,
      smartButtonTextConverter: function(itemText, originalItem) {
        if (itemText === 'Jhon') {
          return 'Jhonny!';
        }
        return itemText;
      },
      scrollableHeight: '200px',
      scrollable: true,
      keyboardControls: true,
      styleActive: true
    };

    $scope.textOptions = {
      checkAll: "Seleccionar todo",
      uncheckAll: "Deseleccionar todo",
      searchPlaceholder: "Buscar",
      buttonDefaultText: "Seleccionar"
    }


  }
]);
