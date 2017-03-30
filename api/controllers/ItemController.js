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
      })
  },

  getAll: function(req, res) {
    var itemsCollection = [];
    var itemNameList = [];
    var itemName = "";
    Item.find()
      .then(function(items) {
        for (var i in items) {
          itemName =items[i].name;
          if (!itemNameList[itemName]) {
            itemNameList[itemName] = Object.keys(itemNameList).length;
            itemsCollection.push({name: itemName, values: []});
          }
          itemsCollection[itemNameList[itemName]].values.push(items[i]);
        }
        sails.log.debug(itemsCollection)
        res.ok(itemsCollection);
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError();
      });
  }
};
