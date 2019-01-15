/**
 * RecipeController
 *
 * @description :: Server-side logic for managing recipes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
   * Funcion para crear un receta.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  createRecipe: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var dough = null;
    var ingredients = [];
    var recipesCredentials = [];
    
    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    dough = req.param('dough');
    if (!dough) {
      return res.badRequest('Se debe ingresar una masa');
    }

    ingredients = req.param('ingredients');
    if (!ingredients) {
      return res.badRequest('Se debe ingresar los ingredientes.');
    }

    Item.findOne({
        id: dough
      })
    .then(dough => {
        if (dough) {
            ingredients.forEach(function(ingredient) {
                var recipeCredentials = {
                    amount: ingredient.amount,
                    ingredient: ingredient.id,
                    dough: dough
                }
                recipesCredentials.push(recipeCredentials);
            })
            return Recipe.createEach(recipesCredentials);
        }else {
            throw Error({
                code: 406,
                msg: "La masa no existe"
            })
        }
    })
    .then(recipe => {
        res.created(recipe);
    })
    .catch(error => {
        res.serverError(error);
    })
 
  },
  /**
   * Funcion para obtener una receta dado la masa.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  getByDough: function(req, res) {
    var dough = null;
    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    dough = req.param('dough');
    if (!dough) {
      return res.badRequest('Se debe ingresar una masa');
    }

    Recipe.find({
        dough: dough
      })
      .populate('dough')
      .populate('ingredient')
      .then(function(recipe) {
        return res.ok(recipe);
      })
      .catch(function(err) {
        res.serverError(err)
      });
  },
  /**
   * Funcion para remover ingredient de una receta.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  removeIngredient: function(req, res) {
    var ingredientId = null;
    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    ingredientId = req.param('ingredientId');
    if (!ingredientId) {
      return res.badRequest('Se debe ingresar el id del ingrediente');
    }

    Recipe.destroy({
        id: ingredientId
      })
      .then(function(recipe) {
        return res.ok(recipe);
      })
      .catch(function(err) {
        res.serverError(err)
      });
  }
};

