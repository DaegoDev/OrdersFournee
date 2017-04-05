/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Funcion para crear un product.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */

  create: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var name = "";
    var shortName = "";
    var items = [];
    var doughName = null;
    var arrayDough = [];
    var numberCode = null;
    items = req.param('items');

    // Se genera el nombre y el nombre abreviado de un producto de acuerdo a los items
    items.forEach(function(item, i, items) {
      item = JSON.parse(item)
      items[i] = item;
      name = name + " " + item.value;
      shortName = shortName + " " + item.shortValue;
    });
    // Organización de credenciales de un producto.
    var productCredentials = {
      name: name,
      short_name: shortName
    };

    //Obtengo la conección para realizar transacciones
    var connectionConfig = AlternativeConnectionService.getConnection();
    var sql = connectionConfig.sql;

    Element.find({
        name: 'masa'
      })
      .populate('items')
      .then(function(elementItems) {
        var arrayObjectsItems = elementItems[0].items;
        arrayObjectsItems.forEach(function(itemObject, i, arrayObjectsItems) {
          // Array que contiene los valores de las masas
          arrayDough.push(itemObject.value);
        });
        // Construye la parte númerica del codigo del producto
        items.forEach(function(item, i, items) {
          if(item.name == 'masa'){
            doughName = item.value;
          }
        })
        // Construye la letra del codigo del producto
        return Item.find({value: doughName}).populate('products')
      })
      .then(function(items) {
        var products = items[0].products;
        if (products == 0) {
          doughNameArray = doughName.replace(/\s/g, '').toLowerCase();
          numberCode = arrayDough.indexOf(doughNameArray) + 1;
          productCredentials.code = numberCode.toString() + "A";
        } else {
          var lastCode = products[products.length - 1].code;
          numberCode = lastCode.replace(/[^0-9]/g, '');
          var lastLetterCode = lastCode.substring(lastCode.length, lastCode.length - 1);
          var letterCode = nextChar(lastLetterCode);
          var code = numberCode + letterCode;
          productCredentials.code = code;
        }
        return sql.beginTransaction()
      })
      // se crea el regitro del producto.
      .then(function() {
        return sql.insert('product', productCredentials)
      })
      .then(function(newProduct) {
        var itemProductCredentials = [];
        items.forEach(function(item, i, items) {
          itemProductCredentials[i] = {
            product: productCredentials.code,
            item: item.id
          };
        });
        return sql.insert('item_product', itemProductCredentials)
      })
      .then(function(itemProduct) {
        sql.commit();
        connectionConfig.connection.end(function(err) {
          if (err) {
            sails.log.debug(err);
          }
        });
        res.created({
          itemProduct: itemProduct
        });
      })
      .catch(function(err) {
        sails.log.debug(err);
        return sql.rollback(function(err) {
          connectionConfig.connection.end(function(err) {
            if (err) {
              sails.log.debug(err);
            }
          });
        });
        res.serverError();
      });
  },

  /**
   * Funcion para obtener los productos de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getProductsByClient: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var clientId = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    clientId = parseInt(req.param('clientId'));
    if (!clientId) {
      return res.badRequest('Id del cliente vacio.');
    }

    // Se verifica que el cliente exista, en caso de que no exista
    // se retorna un error. En caso de que exista se obtiene los productos que se le habilitaron.
    Client.findOne({
        id: clientId
      })
      .then(function(client) {
        if (client) {
          return ClientProduct.find({
              client: clientId
            })
            .populate('product');
        }
        throw "El cliente no existe";
      })
      .then(function(products) {
        res.ok(products);
      })
      .catch(function(err) {
        res.serverError(err);
      })
  },

  /**
   * Funcion para obtener los productos de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getAll: function(req, res) {
    Product.find().populate('items')
      .then(function(products) {
        if (products) {
          return res.ok(products)
        }
        throw "El cliente no existe";
      })
      .catch(function(err) {
        res.serverError(err);
      })
  },
};



// Retorna la letra siguiente de acuerdo al alfabeto de la letra ingresada
function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}
