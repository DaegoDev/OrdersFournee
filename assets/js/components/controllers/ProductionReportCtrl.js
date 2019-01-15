(function () {
    var fournee = angular.module('fournee');
  
    fournee.controller('ProductionReportCtrl', ['$scope', '$log', '$stateParams', '$state', '$ngConfirm', 'ProductionConfigSvc',
    function ($scope, $log, $stateParams, $state, $ngConfirm, ProductionConfigSvc) {
      //Filters values
    $scope.filters = {};
    //Datepicker variables
    $scope.filters.initialDate = new Date();
    $scope.filters.finalDate = new Date();
    $scope.reports = [];
    $scope.generalConfig = null;
    $scope.isRequesting = false;

    $scope.buttonsOptions = {
      show: false,
      now: {
          show: false,
          text: 'Now',
          cls: 'btn-sm btn-default'
      },
      clear: {
          show: false,
      },
    }
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

    /**
     * Function to get the production report by dough
     */
    $scope.getProductionReport = function() {
      // variables declaration
      var tmpInitialDate = null;
      var tmpFinalDate = null;
      var parameters = {};
      
      // Date range to generate the report
      tmpInitialDate = $scope.filters.initialDate.getTime() + (-(new Date().getTimezoneOffset()) * 60 * 1000);
      tmpFinalDate = $scope.filters.finalDate.getTime() + (-(new Date().getTimezoneOffset()) * 60 * 1000);

      //Return error message if not set the initial date or final date
      if (tmpInitialDate !== tmpInitialDate || tmpFinalDate == null || tmpInitialDate == "" 
        || tmpFinalDate !== tmpFinalDate || tmpFinalDate == null || tmpFinalDate == "" ) {
        $ngConfirm("Debe seleccionar la fecha inicial y final de la consulta");
        return;
      }

      // Parameters to call service
      parameters = {
        initialDate: tmpInitialDate,
        finalDate: tmpFinalDate
      }
      
      //Preloader
      $scope.isRequesting = true;

      // call service to get production report
      ProductionConfigSvc.getProductionReport(parameters)
      .then(res => {
        console.log(res.data);
        $scope.generalConfig = res.data.globalConfig;
        var doughs = res.data.doughs;
        //Become object o array in order to iterate
        $scope.reports =  Object.keys(doughs).map(e=>doughs[e]);
        console.log($scope.reports);
        $scope.isRequesting = false;
      })
      .catch(err => {
        console.log(err);
        $scope.isRequesting = false;
      })
    }

    /**
     * function to build the batches of a product
     * @param {*} report 
     */
    $scope.getBatchesValues = function(report) {
        // variables declaration
        var restDoughKneading = 0;
        var maxByProductKneadingG = (report.maxByProductKneading * 1000);
        var distributeDough = false;
        
        // Store the total of dough necesary to produce
        if (!report.total) {
          report.total = 0;
        }

        // save the total of dough to produce by batch
        if (!report.totalByBatch) {
          report.totalByBatch = [];
        }

        // iterate the products of a dough
        report.products.forEach(product => {

            if (typeof(product.amountDoughPrd) === "undefined" || product.amountDoughPrd === null) {
              // save total of dough to produce to the product
              var amountDoughPrd = product.amount * product.weightValue;
              product.amountDoughPrd = amountDoughPrd;
              //Actualiza la cantidad total a elaborar de la masa
              report.total += amountDoughPrd;
            }
            
            // save batches of the product
            if (!product.batches) {
              product.batches = [];
            }
            
            // add the max of dough posible by product
            if (product.amountDoughPrd > maxByProductKneadingG) {
              product.batches.push(maxByProductKneadingG);
              distributeDough = true;
            } else {
              // add the total of dough to produce for a product
              if (product.amountDoughPrd > 0) {
                product.batches.push(product.amountDoughPrd);
                var productBatchesLength = product.batches.length;
                if (typeof(report.totalByBatch[productBatchesLength - 1]) === "undefined") {
                  report.totalByBatch[productBatchesLength - 1] = 0;  
                }
                report.totalByBatch[productBatchesLength - 1] += product.amountDoughPrd;
                // rest of dough to distribute in a batch
                restDoughKneading += (maxByProductKneadingG - product.amountDoughPrd);
              } else {
                product.batches.push(0);
                restDoughKneading += maxByProductKneadingG;
              }
            }
            // decrease the amount dough to produce
            product.amountDoughPrd -= maxByProductKneadingG;
        });
        
        // if is necessary distribute the dough on a batch
        if (distributeDough) {
          var callRecursive = false;
          
          //iterate one more time the products to set more dough to batch if is necessary
          report.products.forEach(product => {
            var productBatchesLength = product.batches.length;
              if (product.amountDoughPrd > 0) {
                var sumValue = 0;
                if (restDoughKneading > product.amountDoughPrd) {
                  sumValue = product.amountDoughPrd;
                  restDoughKneading -= product.amountDoughPrd;
                }  else {
                  sumValue = restDoughKneading;
                  restDoughKneading = 0;
                }
                product.batches[productBatchesLength - 1] += sumValue;
                product.amountDoughPrd -= sumValue;

                // if there are more dough to produce call the function recursively
                if (product.amountDoughPrd > 0) {
                  callRecursive = true;
                }
              }
              // add to the total by batch
              if (typeof(report.totalByBatch[productBatchesLength - 1]) === "undefined") {
                report.totalByBatch[productBatchesLength - 1] = 0;  
              }
              report.totalByBatch[productBatchesLength - 1] += product.batches[productBatchesLength - 1];
          });
          // recursive call
          if (callRecursive) {
            $scope.getBatchesValues(report);
          }
        }
        console.log("Reporte: ", report);
    }


    }]);
  })();
  