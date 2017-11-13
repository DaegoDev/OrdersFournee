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
    var shortNameStr = '';
    var nameStr = '';
    var items = [];
    var price = null;
    var unitsPack = null;
    var doughName = null;
    var arrayDough = [];
    var numberCode = null;
    var mandatoryItems = ['MASA', 'FORMA', 'GRAMAJE CRUDO'];
    var checkedMandatory = [false, false, false];
    var isValid = true;
    var addedItems = [];

    items = req.param('items');
    price = req.param('price');
    unitsPack = parseInt(req.param('unitsPack'));

    // if(!price){
    //   return res.badRequest({
    //     code: 5,
    //     msg: 'There are not price.'
    //   })
    // }

    if (!unitsPack) {
      return res.badRequest({
        code: 5,
        msg: 'There are not price.'
      })
    }

    // Se genera el nombre y el nombre abreviado de un producto de acuerdo a los items
    if (typeof items == 'string') {
      return res.badRequest({
        code: 1,
        msg: 'There are no enough items'
      });
    } else {
      items.forEach(function(item, i, items) {
        // item = JSON.parse(item)
        items[i] = item;
        indexMandatory = mandatoryItems.indexOf(items[i].name.toUpperCase().trim());
        if (indexMandatory != -1) {
          checkedMandatory[indexMandatory] = true;
        }
        index = addedItems.indexOf(items[i].name.toUpperCase().trim());
        if (index != -1) {
          return res.badRequest({
            code: 2,
            msg: 'There are repeated elements.'
          })
        } else {
          addedItems.push(items[i].name.toUpperCase().trim());
        }
      })
    }

    // Lets check if all mandatory items have been send in request.
    checkedMandatory.forEach(function(mandatoryItem, index, data) {
      if (mandatoryItem == false) {
        isValid = false;
      }
    });

    if (!isValid) {
      return res.badRequest({
        code: 3,
        msg: 'There are mandatory items missing.'
      })
    }


    // Organización de credenciales de un producto.
    var productCredentials = {};

    // Enabled product; 1 = true, 0 = false.
    productCredentials.enabled = 1;

    //Obtengo la conexión para realizar transacciones
    var connectionConfig = AlternativeConnectionService.getConnection();
    var sql = connectionConfig.sql;

    Element.find().sort('id ASC')
      .then(function(data) {
        // Lets build the string container sorted by id element, each element is pre-fixed and post-fixed with &
        data.forEach(function(element, index, data) {
          shortNameStr = shortNameStr + '&' + element.name.toUpperCase() + '&';
          nameStr = nameStr + '&' + element.name.toUpperCase() + '&';
        });
        shortNameStr = shortNameStr.trim();
        nameStr = nameStr.trim();

        items.forEach(function(item, i, items) {
          shortNameStr = shortNameStr.replace('&' + items[i].name.trim().toUpperCase() + '&', items[i].shortValue.trim().toUpperCase() + ' ');
          nameStr = nameStr.replace('&' + items[i].name.trim().toUpperCase() + '&', items[i].value.trim() + ' ');
        });
        data.forEach(function(element, index, data) {
          shortNameStr = shortNameStr.replace('&' + element.name.toUpperCase() + '&', '');
          nameStr = nameStr.replace('&' + element.name.toUpperCase() + '&', '');
        });
        shortNameStr = shortNameStr.trim();
        nameStr = nameStr.trim();

        productCredentials.name = nameStr;
        productCredentials.short_name = shortNameStr;
        productCredentials.units_pack = unitsPack;
        // productCredentials.price = price;

        return Element.find({
          name: 'masa'
        }).populate('items');
      })
      .then(function(elementItems) {
        var arrayObjectsItems = elementItems[0].items;
        arrayObjectsItems.forEach(function(itemObject, i, arrayObjectsItems) {
          // Array que contiene los valores de las masas
          var value = itemObject.value;
          arrayDough.push(value.toLowerCase().trim());
        });
        arrayDough.splice(24, 0, 'nulo');
        sails.log.debug(arrayDough);
        // Construye la parte númerica del codigo del producto
        if (items.constructor == [].constructor) {
          items.forEach(function(item, i, items) {
            if (item.name.toLowerCase() == 'masa') {
              doughName = item.value;
            }
          })
        } else {
          doughName = items.value;
        }
        // Construye la letra del codigo del producto
        return Item.find({
          value: doughName
        }).populate('products')
      })
      .then(function(itemsBd) {
        var products = itemsBd[0].products;
        if (products.length == 0) {
          var doughNameArray = doughName.toLowerCase();
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

        if (items.constructor == [].constructor) {
          items.forEach(function(item, i, items) {
            itemProductCredentials[i] = {
              product_code: productCredentials.code,
              item_id: item.id
            };
          });
        } else {
          itemProductCredentials = {
            product_code: productCredentials.code,
            item_id: items.id
          };
        }
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
        sql.rollback(function(err) {
          connectionConfig.connection.end(function(err) {
            if (err) {
              sails.log.debug(err);
            }
          });
        });
        if (err.code == 'ER_DUP_ENTRY') {
          return res.badRequest({
            code: 4,
            msg: 'Product already exists'
          });
        } else {
          return res.serverError();
        }
      });
  },

  /**
   * Funcion para obtener los productos de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  update: function(req, res) {
    var productCode = null;
    var items = null;

    var productCredentials = {};
    var shortNameStr = '';
    var nameStr = '';
    var price = null;
    var unitsPack = null;
    var doughId = null;
    var mandatoryItems = ['MASA', 'FORMA', 'GRAMAJE CRUDO'];
    var checkedMandatory = [false, false, false];
    var isValid = true;
    var addedItems = [];

    productCode = req.param('productCode');
    price = req.param('price');
    unitsPack = parseInt(req.param('unitsPack'))
    items = req.param('items');

    //  Parameter validations.
    if (!items) {
      return res.badRequest({
        code: 1,
        msg: "Mising items parameter"
      });
    }

    //  if (!price) {
    //    return res.badRequest({code:1, msg: "Mising price parameter"});
    //  }

    if (!unitsPack) {
      return res.badRequest({
        code: 1,
        msg: 'Missing units pack parameter'
      });
    }

    if (!productCode) {
      return res.badRequest({
        code: 1,
        msg: "Mising productCode parameter"
      });
    }

    if (typeof items == 'string') {
      return res.badRequest({
        code: 2,
        msg: 'There are no enough items'
      });
    } else {
      items.forEach(function(item, i, items) {
        //  item = JSON.parse(item);
        items[i] = item;

        indexMandatory = mandatoryItems.indexOf(items[i].name.toUpperCase().trim());
        if (indexMandatory != -1) {
          checkedMandatory[indexMandatory] = true;
        }

        index = addedItems.indexOf(items[i].name.toUpperCase().trim());
        if (index != -1) {
          return res.badRequest({
            code: 3,
            msg: 'There are repeated elements.'
          })
        } else {
          addedItems.push(items[i].name.toUpperCase().trim());
        }
      })
    }

    // Lets check if all mandatory items have been send in request.
    checkedMandatory.forEach(function(mandatoryItem, index, data) {
      if (mandatoryItem == false) {
        isValid = false;
      }
    });

    if (!isValid) {
      return res.badRequest({
        code: 3,
        msg: 'There are mandatory items missing.'
      })
    }

    //Obtengo la conexión para realizar transacciones
    var connectionConfig = AlternativeConnectionService.getConnection();
    var sql = connectionConfig.sql;

    Element.find().sort('id ASC')
      .then(function(data) {
        // Lets build the string container sorted by id element,
        // each element is pre-fixed and post-fixed with an & symbol.
        data.forEach(function(element, index, data) {
          if (element.name.toUpperCase().trim() == 'MASA') {
            doughId = element.id;
          }

          shortNameStr = shortNameStr + '&' + element.name.toUpperCase() + '&';
          nameStr = nameStr + '&' + element.name.toUpperCase() + '&';
        });
        shortNameStr = shortNameStr.trim();
        nameStr = nameStr.trim();

        //  Here we replace the pre-proccesed item name with the actual value.
        items.forEach(function(item, i, items) {
          shortNameStr = shortNameStr.replace('&' + items[i].name.trim().toUpperCase() + '&', items[i].shortValue.trim().toUpperCase() + ' ');
          nameStr = nameStr.replace('&' + items[i].name.trim().toUpperCase() + '&', items[i].value.trim() + ' ');
        });

        // Finally let's remove the left pre-proccesed item names that are no used.
        data.forEach(function(element, index, data) {
          shortNameStr = shortNameStr.replace('&' + element.name.toUpperCase() + '&', '');
          nameStr = nameStr.replace('&' + element.name.toUpperCase() + '&', '');
        });
        shortNameStr = shortNameStr.trim();
        nameStr = nameStr.trim();

        productCredentials.code = productCode;
        productCredentials.name = nameStr;
        productCredentials.shortName = shortNameStr;
        //  productCredentials.price = price;
        productCredentials.unitsPack = unitsPack;
        productCredentials.enabled = 1; // Enabled product; 1 = true, 0 = false.

        return ItemProduct.find({
          product_code: productCode
        }).populate('item');
      })
      .then(function(data) {
        var isValid = false;

        for (var i in data) {
          for (var j in items) {
            if (data[i].item.element == doughId && items[j].id == data[i].item.id) {
              isValid = true;
              break;
            }
          }
          if (isValid) {
            break;
          }
        }

        if (!isValid) {
          throw {
            code: 4,
            msg: 'The dough must be de same as the original product.'
          }
        }

        return sql.beginTransaction();
      })
      .then(function() {
        return sql.delete('item_product', {
          product_code: productCode
        });
      })
      .then(function(data) {
        var itemProductCredentials = [];

        items.forEach(function(item, i, items) {
          itemProductCredentials[i] = {
            product_code: productCredentials.code,
            item_id: item.id
          };
        });

        return sql.insert('item_product', itemProductCredentials)
      })
      .then(function(data) {
        return sql.update('product', {
          name: productCredentials.name,
          short_name: productCredentials.shortName,
          price: productCredentials.price,
          units_pack: productCredentials.unitsPack
        }, {
          code: productCredentials.code
        });
      })
      .then(function(data) {
        sql.commit();
        connectionConfig.connection.end(function(err) {
          if (err) {
            sails.log.debug(err);
          }
        });
        return res.ok({
          code: 0,
          msg: "Item updated"
        });
      })
      .catch(function(err) {
        //  rollback all the changes if error.
        sql.rollback(function(errSql) {
          connectionConfig.connection.end(function(errSql) {
            if (errSql) {
              sails.log.debug(errSql);
            }
          });
        });

        if (err.code) {
          return res.badRequest(err);
        } else {
          return res.serverError(err);
        }
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
      'cp.id, cp.client, cp.custom_name, cp.product, cp.custom_price, ' +
      'p.name, p.short_name, p.price, p.units_pack,' +
      'i.value, i.short_value, ' +
      'e.name AS element_name ' +
      'FROM product AS p, item_product AS ip, item AS i, element AS e, client_product AS cp ' +
      'WHERE p.enabled = 1 AND cp.enabled = 1 AND cp.product = p.code AND ip.product_code = p.code AND ip.item_id = i.id AND i.element = e.id AND cp.client = ? ' +
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
        if (err) {
          sails.log.debug(err);
          return res.serverError();
        }
        rawData.forEach(function(data, i, dataArray) {
          if (tmpProduct == null) {
            tmpProduct = {
              code: data.product,
              name: data.name,
              shortName: data.short_name,
              price: data.price,
              unitsPack: data.units_pack,
              items: []
            }
          }

          item = {
              elementName: data.element_name,
              value: data.value,
              shortValue: data.short_value
            },

            tmpProduct.items.push(item);

          if (!dataArray[i + 1]) {
            product = {
              id: data.id,
              clientId: data.client,
              customName: data.custom_name,
              customPrice: data.custom_price,
              unitsPack: data.units_pack,
              product: tmpProduct
            }
            products.push(product);
          } else if (dataArray[i + 1].product != tmpProduct.code) {
            product = {
              id: data.id,
              clientId: data.client,
              customName: data.custom_name,
              customPrice: data.custom_price,
              unitsPack: data.units_pack,
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
  getAllEnabled: function(req, res) {
    var product = null;
    var products = [];
    var item = null;
    var productQueryStr = 'SELECT ' +
      'p.code, p.name, p.short_name, p.price, p.units_pack,' +
      'e.name as element_name, ' +
      'i.id as item_id, i.value, i.short_value ' +
      'FROM product as p, item_product as ip, item as i, element as e ' +
      'WHERE p.code = ip.product_code AND p.enabled = 1 AND ip.item_id = i.id AND i.element = e.id ' +
      'ORDER BY p.code;';

    Product.query(productQueryStr,
      function(err, rawData) {
        if (err) {
          sails.log.debug(err);
          return res.serverError();
        }
        rawData.forEach(function(data, i, dataArray) {
          if (product == null) {
            product = {
              code: data.code,
              name: data.name,
              shortName: data.short_name,
              price: data.price,
              unitsPack: data.units_pack,
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

          if (!dataArray[i + 1]) {
            products.push(product);
          } else if (dataArray[i + 1].code != product.code) {
            products.push(product);
            product = null;
          }
        })
        return res.ok(products)
      });
  },

  getAllDisabled: function(req, res) {
    var product = null;
    var products = [];
    var item = null;
    var productQueryStr = 'SELECT ' +
      'p.code, p.name, p.short_name, ' +
      'e.name as element_name, ' +
      'i.id as item_id, i.value, i.short_value ' +
      'FROM product as p, item_product as ip, item as i, element as e ' +
      'WHERE p.code = ip.product_code AND p.enabled = 0 AND ip.item_id = i.id AND i.element = e.id ' +
      'ORDER BY p.code;';

    Product.query(productQueryStr,
      function(err, rawData) {
        if (err) {
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

          if (!dataArray[i + 1]) {
            products.push(product);
          } else if (dataArray[i + 1].code != product.code) {
            products.push(product);
            product = null;
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
  disableProduct: function(req, res) {
    var productCode = null;

    // Validation of productCode argument.
    productCode = req.param('productCode');
    if (!productCode) {
      return res.badRequest('El id del producto está vacio.');
    }

    // First validate that the product exits.
    Product.findOne({
        code: productCode
      })
      .then(function(productData) {
        if (!productData) {
          throw {
            code: 1,
            msg: "El producto no existe."
          };
        }
        return Product.update({
          code: productCode
        }, {
          enabled: false
        });
      })
      .then(function(productData) {
        if (!productData) {
          throw {
            code: 2,
            msg: "El producto no ha sido actualizado."
          };
        }
        res.type('json');
        return res.ok();
      })
      .catch(function(err) {
        if (err.code) {
          return res.badRequest(err);
        }
        return res.serverError(err);
      });
  },

  enableProduct: function(req, res) {
    var productCode = null;

    // Validation of productCode argument.
    productCode = req.param('productCode');
    if (!productCode) {
      return res.badRequest('El id del producto está vacio.');
    }

    // First validate that the product exits.
    Product.findOne({
        code: productCode
      })
      .then(function(productData) {
        if (!productData) {
          throw {
            code: 1,
            msg: "El producto no existe."
          };
        }
        return Product.update({
          code: productCode
        }, {
          enabled: true
        });
      })
      .then(function(productData) {
        if (!productData) {
          throw {
            code: 2,
            msg: "El producto no ha sido actualizado."
          };
        }
        res.type('json');
        return res.ok();
      })
      .catch(function(err) {
        if (err.code) {
          return res.badRequest(err);
        }
        return res.serverError(err);
      });
  },
  /**
   * Funcion para obtener todos los productos de los clientes con los precios asignados.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getClientsProducts: function(req, res) {
    ClientProduct.find({
        enabled: true
      })
      .populate('product')
      .populate('client')
      .then((clientsProducts) => {
        res.ok(clientsProducts);
      })
      .catch((err) => {
        sails.log.debug(err)
        res.serverError()
      })
  },
  /**
   * Funcion para subir o barjar los precios de todos los productos.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  updateAllPrices: function(req, res) {
    var changeType = null;
    var percentage = null;
    var percentageDecimal = null;

    changeType = req.param('changeType');
    if (!changeType) {
      return res.badRequest('Change type required.')
    }

    percentage = req.param('percentage');
    if (!percentage) {
      return res.badRequest('Percentage required.')
    }

    if (changeType === 2) {
      percentageDecimal = (percentage / 100) + 1;
    } else {
      percentageDecimal = 1 - (percentage / 100)
    }

    ClientProduct.query('UPDATE client_product SET custom_price=custom_price * ? WHERE enabled=true;',
    [percentageDecimal], function(err, rawResult) {
      if (err) {
        return res.serverError(err);
      }

      sails.log.debug(rawResult);
      return res.ok();

    });
  }
};

// Retorna la letra siguiente de acuerdo al alfabeto de la letra ingresada
function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}
