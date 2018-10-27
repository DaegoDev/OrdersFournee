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

          throw {
            code: 461,
            msg: 'El elemento no existe'
          };
        }
        itemCredentials.element = elementId;
        // Se verifica que no haya otro elemento con el mismo valor o abreviación.
        return Item.find({
          or: [{
              value: value
            },
            {
              shortValue: shortValue
            }
          ]
        })
      })
      .then(function(item) {
        if (item.length > 0) {
          throw {
            code: 460,
            msg: "Ya existe un item con ese valor o abreviación"
          };
        }
        // se crea un item en la base de datos
        return Item.create(itemCredentials)

      })
      .then(function(item) {
        res.created(item);
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError(err);
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
        name: name,
        enabled: true
      })
      .populate('items', {
        where: {
          enabled: true
        }})
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
    Element.find({enabled: true})
      .sort('id ASC')
      .populate('items', {
        where: {
          enabled: true
        }})
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

    if (!name) {
      return res.badRequest('Se debe ingresar un nombre.');
    }

    //
    name = name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
    // Organización de credenciales de un elemento.
    var elementCredentials = {
      name: name,
      enabled: true
    };
    sails.log.debug("Elemento: ", elementCredentials);
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
  },

  /**
   * Funcion para realizar borrado lógico de un element.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  deleteElement: function(req, res) {
    // variables declaration
    var elementId = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    elementId = req.param('elementId');

    if (!elementId) {
      return res.badRequest('Se debe ingresar el id del elemento.');
    }

    Element.update({id: elementId})
    .set({enabled: false})
    .then((element) => {
      sails.log.debug("Element: ", element);
      return res.ok(element);
    })
    .catch((err) => {
      res.serverError(err);
    })
  },

  /**
   * Funcion para realizar borrado lógico de un element.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  disableItem: function(req, res) {
    // variables declaration
    var itemId = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    itemId = req.param('itemId');

    if (!itemId) {
      return res.badRequest('Se debe ingresar el id del item.');
    }

    Item.update({id: itemId})
    .set({enabled: false})
    .then((item) => {
      sails.log.debug("Item: ", item);
      return res.ok(item);
    })
    .catch((err) => {
      res.serverError(err);
    })
  },

  /**
   * Funcion obtener los complementos de forma.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getFormComplements: function(req, res) {
    const COMPLEMENTO_FORMA = "Compl. forma";
    var err;
    var complForm = [];
    
    Item.find({enabled: true})
      .populate('element')
      .populate('itemConfig')
      .then(function(items) {
          var lengthCompl = items.length;
          for (i = 0; i < lengthCompl; i++) {
            if (typeof items[i] !== "undefined") {
              if ( items[i].element.name === COMPLEMENTO_FORMA) {
                items[i]["update"] = false;
                complForm.push(items[i]);
              }
            }
          }
          res.ok(complForm);
        })
        .catch(function(err) {
          sails.log.debug(err);
          res.serverError(err);
        });
  }

};
