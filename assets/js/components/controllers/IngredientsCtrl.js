(function () {
    var fournee = angular.module('fournee');
  
    fournee.controller('IngredientsCtrl', ['$scope', '$log', '$stateParams', '$state', '$ngConfirm', 'RecipesSvc',
    function ($scope, $log, $stateParams, $state, $ngConfirm, RecipesSvc) {
        
        //Variables declaration
        $scope.ingredients = [];
        $scope.ingredientName = null;

        //Obtiene los ingredientes configurados en base de datos.
        RecipesSvc.getIngredients()
        .then(res => {
            console.log("Ingredientes: ", res.data);
            $scope.ingredients = res.data;
        })
        .catch(err => {
            $ngConfirm("Error al obtener los insumos");
        })

        //Función que agrega un registro en la tabla ingrediente.
        $scope.addIngredient = function() {
            if ($scope.ingredientName == null) {
                $ngConfirm("Debe ingresar el nombre del insumo");
                return;
            }
            //Obtiene el nombre del ingrediente.
            var paramsIngredient = {
                name: $scope.ingredientName
            };

            //Se llama al servicio que añade el ingrediente.
            RecipesSvc.addIngredient(paramsIngredient)
            .then(res => {
                $scope.ingredients.push(res.data);
            })
            .catch(error => {
                $ngConfirm("Error al obtener los insumos");
            })
        }

    }]);
  })();
  