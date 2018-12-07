(function () {
    var fournee = angular.module('fournee');
  
    fournee.controller('ProductionReportCtrl', ['$scope', '$log', '$stateParams', '$state', '$ngConfirm', 'ProductionConfigSvc',
    function ($scope, $log, $stateParams, $state, $ngConfirm, ProductionConfigSvc) {
      //Filters values
    $scope.filters = {};
    //Datepicker variables
    $scope.filters.initialDate = new Date();
    $scope.filters.finalDate = new Date();
    // clients products values
    // $scope.clientsProducts = [];
    $scope.reports = [];
    $scope.generalConfig = null;

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

    $scope.getProductionReport = function() {
      var tmpInitialDate = null;
      var tmpFinalDate = null;
      var parameters = {};
      
      tmpInitialDate = $scope.filters.initialDate.getTime() + (-(new Date().getTimezoneOffset()) * 60 * 1000);
      tmpFinalDate = $scope.filters.finalDate.getTime() + (-(new Date().getTimezoneOffset()) * 60 * 1000);
      console.log(tmpInitialDate);
      console.log(tmpFinalDate);
      console.log(tmpInitialDate !== tmpInitialDate);
      if (tmpInitialDate !== tmpInitialDate || tmpFinalDate == null || tmpInitialDate == "" 
        || tmpFinalDate !== tmpFinalDate || tmpFinalDate == null || tmpFinalDate == "" ) {
        $ngConfirm("Debe seleccionar la fecha inicial y final de la consulta");
        return;
      }

      parameters = {
        initialDate: tmpInitialDate,
        finalDate: tmpFinalDate
      }
      console.log(parameters);
      ProductionConfigSvc.getProductionReport(parameters)
      .then(res => {
        console.log(res.data);
        $scope.generalConfig = res.data.globalConfig;
        var doughs = res.data.doughs;
        $scope.reports =  Object.keys(doughs).map(e=>doughs[e]);
        console.log($scope.reports);
      })
      .catch(err => {
        console.log(err);
      })
    }

    $scope.getNumber = function(num) {
      return new Array(num);   
    }

    $scope.getBatchValueCodeOne = function(product, maxByProduct) {
      var doughAmount = product.amount * product.weightValue
      return 21;
    }

    $scope.getBatchValueCodeTwo = function(product) {
      return 54;
    }

    $scope.getBatchValueCodeThree = function(product) {
      return 76;
    }

    $scope.getBatchesValues = function(codeBatches, report) {
      // console.log("Code batches: ", codeBatches);
      // console.log("report: ", report);
      // if (codeBatches == 1) {
        var restDoughKneading = [];
        var maxByProductKneadingG = (report.maxByProductKneading * 1000)
        report.products.forEach(product => {
          var amountDoughPrd = product.amount * product.weightValue;
          if (!product.amountDoughPrd) {
            product.amountDoughPrd = amountDoughPrd;
          }
          console.log("Cantidad de masa a producir: ", product.amountDoughPrd);
          if (!product.batches) {
            product.batches = [];
          }

          for (let index = 0; product.amountDoughPrd >= 0; index++) {

            if (product.amountDoughPrd > maxByProductKneadingG) {
              product.batches.push(maxByProductKneadingG)
            } else {
              if (product.amountDoughPrd > 0) {
                if (!restDoughKneading[index]) {
                  restDoughKneading[index] = 0;
                }
                product.batches.push(product.amountDoughPrd);
                restDoughKneading[index] += maxByProductKneadingG - product.amountDoughPrd;
              } else {
                product.batches.push("");
              }
            }
            product.amountDoughPrd -= maxByProductKneadingG;
          }
        });

        console.log("Masa restante por tanda: ", restDoughKneading);
        var restDoughKneadingLength = restDoughKneading.length;
        for (let index = 0; index < restDoughKneadingLength; index++) {
          const element = restDoughKneading[index];
          
        }
        report.products.forEach(product => {
          console.log("Producto: ", product)
        });
      // } else if(codeBatches == 2){

      // } else if(codeBatches == 3){

      // }
    }


    }]);
  })();
  