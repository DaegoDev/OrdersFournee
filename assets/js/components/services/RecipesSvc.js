angular.module('fournee')
.factory('RecipesSvc', ['$http', '$rootScope',
function ($http, $rootScope) {
  return {
    // Service to get the ingredients.
    getIngredients: function() {
      var ingredients = $http({
        url: '/ingredient/getAll',
        method: 'GET',
      });
      return ingredients;
    },
    // Service to create the ingredient.
    addIngredient: function(params) {
      var ingredientAdded = $http({
        url: '/ingredient/add',
        method: 'POST',
        data: params
      });
      return ingredientAdded;
    },
    // Service to get recipe by dough.
    getByDough: function(params) {
        var recipe = $http({
            url: '/recipe/get',
            method: 'GET',
            params: params
        });
        return recipe;
    },
    createRecipe: function(params) {
      var recipeAdded = $http({
        url: '/recipe/create',
        method: 'POST',
        data: params
      });
      return recipeAdded;
    }, 
    deleteIngredient: function(params) {
      var ingredientRemoved = $http({
        url: '/recipe/removeIngredient',
        method: 'PUT',
        data: params
      });
      return ingredientRemoved;
    }
  };
}]);