/**
 * IngredientController
 *
 * @description :: Server-side logic for managing ingredients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
   * Funcion para crear un ingrediente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */

  addIngredient: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var name = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    name = req.param('name');
    if (!name) {
      return res.badRequest('Se debe enviar el nombre del ingrediente.');
    }

    name = name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();

    // Organización de credenciales de un item.
    var ingredientCredentials = {
      name: name,
    };

    // Se verifica que no haya otro ingrediente con el mismo nombre
    Ingredient.find({name: name})
      .then(function(ingredient) {
        if (ingredient.length > 0) {
          throw {
            code: 460,
            msg: "Ya existe un ingrediente con el mismo nombre"
          };
        }
        // se crea un ingrediente en la base de datos
        return Ingredient.create(ingredientCredentials)

      })
      .then(function(ingredient) {
        res.created(ingredient);
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError(err);
      });
  },
  /**
   * Funcion para obtener todos los ingredientes.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getAll: function(req, res) {
    // Consultamos todos los ingredientes en la base de datos
    Ingrediente.find({enabled: true})
      .sort('id ASC')
      .then(function(ingrediente) {
        res.ok(ingrediente);
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError(err);
      });
  }
};

