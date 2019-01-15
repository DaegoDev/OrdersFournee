(function () {
    var fournee = angular.module('fournee');
  
    fournee.controller('RecipeConfigCtrl', ['$scope', '$log', '$stateParams', '$state', '$ngConfirm', 
     'productItemSvc', 'RecipesSvc',
    function ($scope, $log, $stateParams, $state, $ngConfirm, productItemSvc, RecipesSvc) {
        
        //variables globales para la configuración de las recetas.
        $scope.doughs = [];
        $scope.ingredients = [];
        $scope.doughSelected = null;
        $scope.ingredientsSelected = [];
        $scope.numIngredientsToCreate = 0;
        
        //Se obtiene y asigna las masas registradas en el sistema.
        productItemSvc.getDoughs()
        .then(res => {
            console.log(res.data);
            $scope.doughs = res.data;
        })
        .catch(err => {

        })

        //Consume el servicio que obtiene los ingredientes por medio de un servicio REST.
        RecipesSvc.getIngredients()
        .then(res => {
            $scope.ingredients = res.data;
        })
        .catch(err => {

        })

        //Muestra los ingredientes registrados en el sistema.
        $scope.showAllIngredients = function() {
            //Se carga el modal con los ingredientes.
            $ngConfirm({
                title: 'Insumos',
                contentUrl: 'templates/private/admin/recipe/load-ingredients-table.html',
                scope: $scope,
                buttons: {
                  removeAll: {
                    text: 'Remover todo',
                    btnClass: 'btn-red',
                    action: function(scope, button) {
                        $scope.removeIngredientsSelected();
                        $scope.$apply();
                    }
                  },
                  confirm: {
                    text: 'Confirmar',
                    btnClass: 'btn btn-sienna',
                    action: function(scope, button) {
        
                    }
                  }
                }
              })
        }

        //Remueve todo los ingredientes seleccionados para crear una receta.
        $scope.removeIngredientsSelected = function() {
            //Se elimina del array.
            $scope.ingredientsSelected.splice($scope.ingredientsSelected.length - $scope.numIngredientsToCreate,  $scope.ingredientsSelected.length );
            console.log("Ingredientes seleccionados: ", $scope.ingredientsSelected);
            $scope.numIngredientsToCreate = 0;
            $scope.hasIngredients = true;
            resetIngredientsAdded();
        }

        //Remueve un ingrediente seleccionado.
        $scope.removeIngredientOfList = function(ingredient) {
            var indexIngredientsSelected = $scope.ingredientsSelected.indexOf(ingredient);
            $scope.ingredientsSelected.splice(indexIngredientsSelected, 1);
            ingredient.added = false;
            $scope.numIngredientsToCreate--;
            if ($scope.ingredientsSelected.length == 0) {
                $scope.hasIngredients = true;
            }
        }

        //Agrega un ingrediente a la receta.
        $scope.addIngredientToList = function(ingredient) {
            console.log("Añadir ingrediente: ", ingredient);
            //Si ya se agregó a la lista no permite agregarlo nuevamente.
            if (isAdded(ingredient)) {
                $ngConfirm("El ingrediente ya se ha agregado.");
                return;
            }
            $scope.hasIngredients = false;
            //Lo agrega al array de ingredientes seleccionados.
            $scope.ingredientsSelected.push(ingredient);
            ingredient.added = true;
            $scope.numIngredientsToCreate++;
        }

        //Valida si el ingrediente ya esta en el array de ingredientes seleccionados.
        function isAdded(ingredient) {
            var isAdded = false;
            var ingredientsSelectedLength = $scope.ingredientsSelected.length;
            for (let index = 0; index < ingredientsSelectedLength; index++) {
                if ($scope.ingredientsSelected[index].id === ingredient.id) {
                    isAdded = true;
                    break;
                }
                
            }
            return isAdded;
        }

        //Muestra la receta creada de una masa.
        $scope.showRecipe = function(dough) {
            $scope.hasIngredients = false;
            $scope.ingredientsSelected = [];
            console.log(dough.value);
            $scope.doughSelected = dough;
            //Construye los parametros para el servicio REST.
            var recipeParam = {
                dough: dough.id
            }
            //Consume el servicio REST.
            RecipesSvc.getByDough(recipeParam)
            .then(res => {
                console.log("receta dado la masa: ", res.data);
                var recipes = res.data;
                //Si tiene ingredientes configurados construye los objetos de la tabla.
                if (recipes.length > 0) {
                    $scope.hasIngredients = true;
                    recipes.forEach(recipe => {
                        var recipeConfigured = {
                            name: recipe.ingredient.name,
                            id: recipe.ingredient.id,
                            amount: recipe.amount,
                            ingredientRecipe: recipe.id
                        }
                        $scope.ingredientsSelected.push(recipeConfigured);
                    }); 
                }
                resetIngredientsAdded();
                
            })
            .catch(err => {
            
            })
        }

        //Se recorre los ingredientes y se actualiza el atributo added a false
        function resetIngredientsAdded() {
            $scope.ingredients.forEach(ingredient => {
                ingredient.added = false;
                ingredient.amount = "";
            });
        }

        // Validate number in input
        $scope.validateNumber = function(itemConfig, config){
            // var amount = itemConfig[config];
            // itemConfig[config] = parseInt(amount.match(/\d+/))            
        };

        //Crea receta de una masa
        $scope.createRecipe = function(){
            var ingredientsSelected = $scope.ingredientsSelected.slice($scope.ingredientsSelected.length - $scope.numIngredientsToCreate, $scope.ingredientsSelected.length);
            
            console.log("Cantidad de ingredientes seleccionadas: ", $scope.numIngredientsToCreate);
            console.log("Array original: ", $scope.ingredientsSelected);
            console.log("Array ingredients seleccionados: ", ingredientsSelected);
            //Valida que se haya seleccionado al menos un ingrediente.
            if (ingredientsSelected.length == 0) {
                $ngConfirm("Seleccione al menos un ingrediente");
                return;
            }
            //Valida que se ingresen las cantidades para cada ingrediente.
            var ingredientsSelectedLength = ingredientsSelected.length; 
            for (let index = 0; index < ingredientsSelectedLength; index++) {
                if (ingredientsSelected[index].amount == null || ingredientsSelected[index].amount == "") {
                    $ngConfirm("Ingrese las cantidades de todos los ingrediente");
                    return;
                }
            }

            //Parametros para el servicio REST.
            var recipeParams = {
                ingredients: ingredientsSelected,
                dough: $scope.doughSelected.id
            }

            //Consume servicio que crea la receta.
            RecipesSvc.createRecipe(recipeParams)
            .then(res => {
                console.log("La receta se creó correctament ", res.data);
                $ngConfirm("La receta se creó correctament");
            })
            .catch(err => {
                $ngConfirm("Ocurrió un error al crear la receta");
            })
        };

        //Genera el modal para eliminar un ingrediente.
        $scope.confirmRemoveIngredient = function (indexIngredientSelected, ingredient) {
            console.log("Ingrediente a eliminar: ", ingredient);
            $ngConfirm({
                title: 'Eliminar ingrediente',
                useBootstrap: true,
                content: '¿Está seguro que desea eliminar el ingrediente?',
                type: 'red',
                columnClass: 'small',
                backgroundDismiss: true,
                buttons: {
                  confirm: {
                    text: 'Confirmar',
                    btnClass: 'btn-sienna',
                    action: function () {
                    var ingredientParam = {
                        ingredientId: ingredient.ingredientRecipe
                    }
                    RecipesSvc.deleteIngredient(ingredientParam)
                      .then(function (res) {
                        $ngConfirm("El ingrediente se ha eliminado correctamente");
                        $scope.ingredientsSelected.splice(indexIngredientSelected, 1);
                      })
                      .catch(function (err) {
                        $ngConfirm("El ingrediente no ha sido eliminado, intente nuevamente.");
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
  