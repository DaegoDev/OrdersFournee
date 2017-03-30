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
    var code = null;
    var name = "";
    var shortName = "";
    var items = [];

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    code = req.param('code');
    if (!code) {
      return res.badRequest('Se debe ingresar un codigo.');
    }

    //items = req.param('items');
    items = [
  {
    "name": "masa",
    "value": "clasica",
    "id": 3,
    "shortValue": "cla"
  },
  {
    "name": "forma",
    "value": "barra",
    "id": 7,
    "shortValue": "bar"
  },
   {
    "name": "complemento forma",
    "value": "bandeja cavidades",
    "id": 10,
    "shortValue": "cv"
  },
  {
    "name": "gramaje crudo",
    "value": "120",
    "id": 14,
    "shortValue": "120"
  },
 {
    "name": "dimension",
    "value": "15x9",
    "id": 20,
    "shortValue": "15x9"
  }
  ];

    items.forEach(function(item, i, items) {
      name = name + " " + item.value;
      shortName = shortName + " " + item.shortValue;
    });

    // Organización de credenciales de un producto.
    var productCredentials = {
      code: code,
      name: name,
      short_name: shortName
    };

    //Obtengo la conección para realizar transacciones
    var connectionConfig = AlternativeConnectionService.getConnection();
    var sql = connectionConfig.sql;

    // Se verifica que el usuario no exista antes de su creación, en caso de que exista
    // se retorna un error de conflicto con codigo de error 409. En caso de que no exista
    // se crea el regitro del usuario.
    sql.beginTransaction()
      .then(function() {
        return sql.select('product', {
          code: code
        });
      })
      .then(function(product) {
        if (product.length == 0) {
          return sql.insert('product', productCredentials)
        }
        return res.conflict();
      })
      .then(function(newProduct) {
        var itemProductCredentials = [];
        items.forEach(function(item, i, items) {
          itemProductCredentials[i]= {product: productCredentials.code, item: item.id};
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
    sails.log.debug(clientId);
    Client.findOne({id: clientId})
    .then(function(client) {
      if(client){
        return ClientProduct.find({client: clientId})
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
};
