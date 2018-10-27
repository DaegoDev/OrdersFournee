(function () {
    var fournee = angular.module('fournee');
  
    fournee.controller('ProductionConfigCtrl', ['$scope', '$log', '$stateParams', '$state', '$ngConfirm', 
    'ProductionConfigSvc', 'productItemSvc',
    function ($scope, $log, $stateParams, $state, $ngConfirm, ProductionConfigSvc, productItemSvc) {
        
        // Global variables of the controller.
        $scope.productionConfig = [];
        $scope.formComplents = [];

        // Get production config before load the view
        ProductionConfigSvc.getProductionConfig()
        .then(function (productionConfig) {
            $scope.productionConfig = productionConfig.data;
          })
          .catch(function (err) {
            console.log(err);
          });
        
        // Get item config before load the view
        productItemSvc.getFormComplements()
        .then(function (formComplements) {
            console.log(formComplements)
            $scope.formComplements = formComplements.data;
          })
          .catch(function (err) {
            console.log(err);
          });
        
        // Function to enable inputs to update item config.
        $scope.enableConfirmUpdate = function(formComplement){
            formComplement.update = true;
        }

        // Function to disable inputs to update item config.
        $scope.disableConfirmUpdate = function(formComplement){
            formComplement.update = false;
        }

        // Function to update an item config.
        $scope.updateItemConfig = function(formComplement){
            console.log("update config: ", formComplement);
            // variables declaration.
            var moldAmount = "";
            var amountByTin = "";
            
            // Item config data.
            var itemConfig = formComplement.itemConfig[0];
            moldAmount = itemConfig.moldAmount;
            amountByTin = itemConfig.amountByTin;

            // valid if moldAmount or amountByTin are null or empty.
            if (isNaN(moldAmount) || moldAmount == "" || isNaN(amountByTin) || amountByTin == "") {
                $ngConfirm("Debe ingresar correctamente los datos");
                return;
            }
            // Params to update o create config.
            var params = {
                moldAmount: moldAmount,
                amountByTin: amountByTin
            }
            console.log(itemConfig.id);
            // if there is an id in item config the function must to update the record.
            // on another hand if there is not an id create the config 
            if (itemConfig.id) {
                params["itemConfigId"] = itemConfig.id;
                console.log("Update ");
            }else{
                params["itemId"] = formComplement.id
                console.log("Create");
            }
            console.log("item config: ", params);

            // Call service to update or create config.
            functionConfigItem(itemConfig, params)
            .then(function(res) {
                console.log(res);
                formComplement.update = false;
                $ngConfirm("Se configuró correctamente");
            })
            .catch(function(err){
                console.log(err);
                $ngConfirm("No se pudo configurar correctamente");
            })
            
        }
        
        // Valid if is create or update.
        function functionConfigItem(itemConfig, params) {
            return itemConfig.id ? ProductionConfigSvc.updateConfigItem(params) : ProductionConfigSvc.createConfigItem(params);
        }

        // Validate number in input
        $scope.validateNumber = function(itemConfig, config){
            var amount = itemConfig[config];
            itemConfig[config] = parseInt(amount.match(/\d+/))            
        };

    }]);
  })();
  