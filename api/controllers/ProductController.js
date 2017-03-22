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

    //crea una coneccion con mysql
    var mySqlPath = process.env.PWD + '/node_modules/sails-mysql/node_modules/mysql';
    var mysql = require(mySqlPath);

    var sailsMySqlConfig = sails.config.connections.localMysql;
    var connection = mysql.createConnection({
      host: sailsMySqlConfig.host,
      user: sailsMySqlConfig.user,
      password: sailsMySqlConfig.password,
      database: sailsMySqlConfig.database
    });

    // Paso la coneccion al constructor de la libreria mysql-wrap
    var createMySQLWrap = require('mysql-wrap');
    var sql = createMySQLWrap(connection);

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
        connection.end(function(err) {
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
          connection.end(function(err) {
            if (err) {
              sails.log.debug(err);
            }
          });
          res.serverError();
        });
      });
  },
};
