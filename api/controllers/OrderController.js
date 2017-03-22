/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Funcion para crear un pedido.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  create: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var createdAt = null;
    var deliveryDate = null;
    var state = null;
    var initialSuggestedTime = null;
    var finalSuggestedTime = null;
    var additionalInformation = null;
    var observation = null;
    var productsToOrder = [];

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    var deliveryDateString = req.param('deliveryDate');
    if (!deliveryDateString) {
      return res.badRequest('Se debe ingresar la fecha de entrega.');
    }
    var dataDate = deliveryDateString.split("-", 3);
    deliveryDate = new Date(dataDate[0], dataDate[1], dataDate[2]);

    client = parseInt(req.param('client'));
    if (!client) {
      return res.badRequest('Id del cliente vacio.');
    }

    clientEmployee = parseInt(req.param('clientEmployee'));
    if (!clientEmployee) {
      return res.badRequest('Id del empleado del cliente vacio.');
    }

    initialSuggestedTime = req.param('initialSuggestedTime');
    finalSuggestedTime = req.param('finalSuggestedTime');
    additionalInformation = req.param('additionalInformation');
    observation = req.param('observation');

    createdAt = new Date();
    if (!isCorrectDeliveryDate(createdAt, deliveryDate)) {
      return res.badRequest("La fecha de entrega no es correcta");
    }
    state = setState(createdAt, deliveryDate);
    sails.log.debug("El estado es: " + state);

    var orderCredentials = {
      created_at: createdAt,
      delivery_date: deliveryDate,
      state: state,
      initial_suggested_time: initialSuggestedTime,
      final_suggested_time: finalSuggestedTime,
      additional_information: additionalInformation,
      observation: observation
    };

    Client.findOne({
        id: client
      })
      .then(function(client) {
        if (client) {
          orderCredentials.client = client.id;
          return ClientEmployee.findOne({
            id: clientEmployee
          });
        }
        return res.badRequest("El cliente no existe");
      })
      .then(function(clientemployee) {
        if (clientemployee) {
          orderCredentials.client_employee = clientemployee.id;
        }
        return res.badRequest("El empleado no existe");
      })
      .catch(function(err) {
        sails.log.debug(err);
        return res.serverError();
      });

    productsToOrder = [{
        client_product: 1,
        amount: 10,
        baked: true
      },
      {
        client_product: 2,
        amount: 12,
        baked: false
      },
      {
        client_product: 3,
        amount: 20,
        baked: false
      }
    ];

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

    sql.beginTransaction()
      .then(function() {
        return sql.insert('order', orderCredentials);
      })
      .then(function(order) {
        productsToOrder.forEach(function(product, i, productsToOrder) {
          //ClientProduct.findOne({
          //    id: product.client_product
          //  })
          //  .then(function(clientProduct) {
          //    if (clientProduct) {
                product.order = order.insertId;
          //    }
          //    return res.serverError();
          //  });
        });
        sails.log.debug(productsToOrder);
        return sql.insert('order_product', productsToOrder);
      })
      .then(function(orderProduct) {
        sql.commit();
        connection.end(function(err) {
          if (err) {
            sails.log.debug(err);
          }
        });
        res.created({
          orderProduct: orderProduct
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
          res.serverError("No se pudo crear el pedido");
        });
      });

  }
};

function isCorrectDeliveryDate(createdAt, deliveryDate) {
  var createdTime = createdAt.getHours();
  var createdDay = createdAt.getDate();
  var createdMonth = createdAt.getMonth();
  var deliveryDay = deliveryDate.getDate();
  var deliveryMonth = deliveryDate.getMonth();
  var isCorrect = true;

  if (deliveryMonth < createdMonth || (createdTime > 3 && deliveryDay <= createdDay)) {
    isCorrect = false;
  }
  return isCorrect;
}

function setState(createdAt, deliveryDate) {
  var createdTime = createdAt.getHours();
  var createdDay = createdAt.getDate();
  var deliveryDay = deliveryDate.getDate();
  var state = "confirmado";

  if (((createdTime > 15 && createdTime < 23) && deliveryDay == (createdDay + 1)) ||
    ((createdTime >= 0 && createdTime < 4) && deliveryDay == createdDay)) {
    state = "pendiente de confirmacion";
  }
  return state;
}
