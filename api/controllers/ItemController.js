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

  createItem: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var elementId = null;
    var value = null;
    var shortValue = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    elementId = req.param('elementId');
    if (!elementId) {
      return res.badRequest('Se debe enviar el id del elemento.');
    }

    value = req.param('value');
    if (!value) {
      return res.badRequest('Se debe ingresar un valor.');
    }

    shortValue = req.param('shortValue');
    if (!shortValue) {
      return res.badRequest('Se debe ingresar el valor abreviado.');
    }

    value = value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
    shortValue = shortValue.toUpperCase();
    // Organización de credenciales de un item.
    var itemCredentials = {
      value: value,
      shortValue: shortValue
    };
    //Se verifica que el elemento exista
    Element.findOne({
        id: elementId
      })
      .then(function(element) {
        if (!element) {
          throw 'El elemento no existe';
        }
        itemCredentials.element = elementId;
        // se crea un item en la base de datos
        return Item.create(itemCredentials)
      })
      .then(function(item) {
        res.created(item);
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
    Element.find({
        name: name
      })
      .populate('items')
      .then(function(items) {
        // delete items['name'];
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
    Element.find()
      .sort('id ASC')
      .populate('items')
      .then(function(items) {
        res.ok(items);
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError(err);
      });
  },
  /**
   * Funcion para crear un element.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */

  createElement: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var name = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    name = req.param('name');
    sails.log.debug(req.param)
    sails.log.debug(req.param('name'))
    if (!name) {
      return res.badRequest('Se debe ingresar un nombre.');
    }

    //
    name = name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
    // Organización de credenciales de un elemento.
    var elementCredentials = {
      name: name,
    };

    // se crea un elemento en la base de datos
    Element.create(elementCredentials)
      .then(function(element) {
        res.created(element);
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError();
      });
  },

  /**
   * Funcion para crear un element.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getProductPriority: function(req, res) {
    var priorities = {};
    Element.find().sort('id ASC')
      .then(function(data) {
        priorities.mandatory = ['MASA', 'FORMA', 'GRAMAJE CRUDO'];
        priorities.order = [];
        data.forEach(function(element, i, elements) {
          priorities.order.push(element.name.toUpperCase().trim());
        });
        return res.ok(priorities);
      })
      .catch(function(err) {
        sails.log.debug(err);
        return res.serverError();
      });
  }
};
