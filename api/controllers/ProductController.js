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
          if (item.name == 'masa') {
            doughName = item.value;
          }
        })
        // Construye la letra del codigo del producto
        return Item.find({
          value: doughName
        }).populate('products')
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
            product_code: productCredentials.code,
            item_id: item.id
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
    var product = null;
    var tmpProduct = null;
    var products = [];
    var item = null;
    var clientProductQueryStr =
    'SELECT ' +
    'cp.id, cp.client, cp.custom_name, cp.product, ' +
    'p.name, p.short_name, ' +
    'i.value, i.short_value, ' +
    'e.name AS element_name ' +
    'FROM product AS p, item_product AS ip, item AS i, element AS e, client_product AS cp ' +
    'WHERE cp.product = p.code AND ip.product_code = p.code AND ip.item_id = i.id AND i.element = e.id AND cp.client = ? ' +
    'ORDER BY cp.product; ';

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    clientId = parseInt(req.param('clientId'));
    if (!clientId) {
      return res.badRequest('Id del cliente vacio.');
    }

    // Se verifica que el cliente exista, en caso de que no exista
    // se retorna un error. En caso de que exista se obtiene los productos que se le habilitaron.
    Product.query(clientProductQueryStr, clientId,
      function(err, rawData) {
        if(err) {
          sails.log.debug(err);
          return res.serverError();
        }
        rawData.forEach(function(data, i, dataArray) {
          if (tmpProduct == null) {
            tmpProduct = {
              code: data.product,
              name: data.name,
              shortName: data.short_name,
              items: []
            }
          }

          item = {
            elementName: data.element_name,
            value: data.value,
            shortValue: data.short_value
          },

          tmpProduct.items.push(item);

          if (!dataArray[i+1]) {
            product = {
              id: data.id,
              clientId: data.client,
              customName: data.custom_name,
              product: tmpProduct
            }
            products.push(product);
          } else if (dataArray[i+1].product != tmpProduct.code) {
            product = {
              id: data.id,
              clientId: data.client,
              customName: data.custom_name,
              product: tmpProduct
            }
            products.push(product);
            tmpProduct = null;
          }
        })

        return res.ok(products)
      });
  },

  /**
   * Funcion para obtener todos los productos.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getAll: function(req, res) {
    var product = null;
    var products = [];
    var item = null;
    var productQueryStr= 'SELECT ' +
      'p.code, p.name, p.short_name, ' +
      'e.name as element_name, ' +
      'i.id as item_id, i.value, i.short_value ' +
      'FROM product as p, item_product as ip, item as i, element as e ' +
      'WHERE p.code = ip.product_code AND ip.item_id = i.id AND i.element = e.id ' +
      'ORDER BY p.code;';

    Product.query(productQueryStr,
      function(err, rawData) {
        if(err) {
          sails.log.debug(err);
          return res.serverError();
        }
        rawData.forEach(function(data, i, dataArray) {
          if (product == null) {
            product = {
              code: data.code,
              name: data.name,
              shortName: data.short_name,
              items: []
            }
          }

          item = {
            itemId: data.item_id,
            elementName: data.element_name,
            value: data.value,
            shortValue: data.short_value
          },

          product.items.push(item);

          if (!dataArray[i+1]) {
            products.push(product);
          } else if (dataArray[i+1].code != product.code) {
            products.push(product);
            product = null;
          }
        })
        return res.ok(products)
      });
  },
};

// Retorna la letra siguiente de acuerdo al alfabeto de la letra ingresada
function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}
