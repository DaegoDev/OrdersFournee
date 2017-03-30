/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Funcion para crear un item.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */

  create: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var name = null;
    var value = null;
    var shortValue = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    name = req.param('name');
    if (!name) {
      return res.badRequest('Se debe ingresar un nombre.');
    }

    value = req.param('value');
    if (!value) {
      return res.badRequest('Se debe ingresar un valor.');
    }

    shortValue = req.param('shortValue');
    if (!shortValue) {
      return res.badRequest('Se debe ingresar el valor abreviado.');
    }

    // Organización de credenciales de un item.
    var itemCredentials = {
      name: name,
      value: value,
      shortValue: shortValue
    };

    // se crea un item en la base de datos
    Item.create(itemCredentials)
      .then(function(item) {
        res.created({
          item: item
        });
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError();
      });
  },
  /**
   * Funcion para obtener items dado su nombre.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getByName: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var name = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    name = req.param('name');
    if (!name) {
      return res.badRequest('Se debe ingresar el nombre del item.');
    }
    //Obtenemos los valores y los valores abreviados dado su nombre.
    Item.find({
        name: name
      })
      .then(function(items) {
        delete items['name'];
        res.ok(items);
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError();
      });
  },
  /**
   * Funcion para obtener todos los items.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getAll: function(req, res) {
    // Consultamos todos los items en la base de datos
    Item.find()
      .then(function(items) {
        var arrayItems = {};
        items.forEach(function(item, index, items) {
          var itemName = item.name;
          var id = item.id;
          var value = item.value;
          var shortValue = item.shortValue;
          if (!arrayItems[itemName]) {
            arrayItems[itemName] = {};
            arrayItems[itemName].name = itemName;
            arrayItems[itemName].values = [];
          }
          arrayItems[itemName].values.push({
            id: id,
            value: value,
            shortValue: shortValue
          });
        })
        res.ok(arrayItems);
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError(err);
      });
  },

};
