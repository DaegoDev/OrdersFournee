/**
* OrderController
*
* @description :: Server-side logic for managing orders
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

var schedule = require('node-schedule');

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
    var deliveryDateDesired = null;
    var deliveryDate = null;
    var state = null;
    var initialSuggestedTime = null;
    var finalSuggestedTime = null;
    var additionalInformation = null;
    var observation = null;
    var productsToOrder = [];

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    var userId = req.user.id;

    var deliveryDate = req.param('deliveryDate');
    if (!deliveryDate) {
      return res.badRequest('Se debe ingresar la fecha de entrega.');
    }

    clientEmployee = parseInt(req.param('clientEmployee'));
    if (!clientEmployee) {
      return res.badRequest('Id del empleado del cliente vacio.');
    }

    initialSuggestedTime = req.param('initialSuggestedTime');
    if (!initialSuggestedTime) {
      return res.badRequest('Debe ingresar una hora inicial de entrega.');
    }

    finalSuggestedTime = req.param('finalSuggestedTime');
    if (!finalSuggestedTime) {
      return res.badRequest('Debe ingresar una hora final de entrega.');
    }

    additionalInformation = req.param('additionalInformation');

    createdAt = TimeZoneService.getDate({});
    deliveryDateDesired = TimeZoneService.getDate({timestamp: deliveryDate})
    if (!isCorrectDeliveryDate(createdAt, deliveryDateDesired)) {
      return res.badRequest("La fecha de entrega no es correcta");
    }

    isValid = validateDeliveryDateDesired(createdAt, deliveryDateDesired);
    if (isValid) {
      state = "Confirmado";
      deliveryDate = deliveryDateDesired;
    } else {
      state = "Pendiente de confirmación";
      deliveryDateDesired.setUTCDate(deliveryDateDesired.getUTCDate() + 1);
      if (deliveryDateDesired.getUTCDay() == 0) {
        deliveryDateDesired.setUTCDate(deliveryDateDesired.getUTCDate() + 1)
      }
      deliveryDate = deliveryDateDesired;
    }

    // crear las credenciales para guardar un pedido
    var orderCredentials = {
      created_at: createdAt,
      delivery_date: deliveryDate,
      state: state,
      initial_suggested_time: initialSuggestedTime,
      final_suggested_time: finalSuggestedTime,
      additional_information: additionalInformation,
      observation: observation
    };

    sails.log.debug(orderCredentials);

    // Arreglo de productos para registrar con la pedido
    productsToOrder = req.param('productsToOrder');
    if (!productsToOrder) {
      return res.badRequest("Se deben ingresar productos al pedido.");
    }

    //Obtengo la conección para realizar transacciones
    var connectionConfig = AlternativeConnectionService.getConnection();
    var sql = connectionConfig.sql;

    sql.beginTransaction()
    .then(function() {
      return Client.findOne({
        user: userId
      });
    })
    .then(function(client) {
      if (client) {
        orderCredentials.client = client.id;
        return ClientEmployee.findOne({
          id: clientEmployee
        });
      }
      throw "El cliente no existe";
    })
    .then(function(clientemployee) {
      if (clientemployee) {
        orderCredentials.client_employee = clientemployee.id;
        return sql.insert('order', orderCredentials);
      }
      throw "El empleado no existe";
    })
    .then(function(order) {
      productsToOrder.forEach(function(product, i, productsToOrder) {
        product.order_id = order.insertId;
      });
      return Promise.all = [order.insertId, sql.insert('order_product', productsToOrder)];
    })
    .spread(function(orderId, orderProduct) {
      sql.commit();
      if (!isValid) {
        var rule = new schedule.RecurrenceRule();
        rule.year = createdAt.getUTCFullYear()
        rule.month = createdAt.getUTCMonth();
        rule.date = createdAt.getUTCDate() + 1;
        rule.hour = 14;
        rule.minute = 1;
        var j = schedule.scheduleJob(orderId.toString(), rule, function(y) {
          Order.update(orderId, {
            state: "Confirmado"
          })
          .then(function(order) {
            sails.log.debug("Se confirmo automaticamente el pedido" + order.id.toString());
          })
        }.bind(null, orderId));
      }
      connectionConfig.connection.end(function(err) {
        if (err) {
          sails.log.debug(err);
        }
      });
      res.created({
        orderProduct: orderProduct,
        deliveryDate: deliveryDate
      });
    })
    .catch(function(err) {
      sql.rollback(function(err) {
        connectionConfig.connection.end(function(err) {
          if (err) {
            sails.log.debug(err);
          }
        });
      });
      res.serverError(err);
    });
  },
  /**
  * Funcion para editar un pedido.
  * @param  {Object} req Request object
  * @param  {Object} res Response object
  * @return {Object}
  */
  update: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var orderId = null;
    var deliveryDate = null;
    var clientEmployee = null;
    var initialSuggestedTime = null;
    var finalSuggestedTime = null;
    var additionalInformation = null;
    var updatedAt = null;
    var productsToUpdate = [];
    var productsOrdered = [];
    var productsToAdd = [];
    var productsToRemove = [];

    // Definición de variables apartir de los parametros de la solicitud y validaciones.

    orderId = parseInt(req.param('orderId'));
    if (!orderId) {
      return res.badRequest('Id del pedido vacio.');
    }

    var deliveryDate = req.param('deliveryDate');
    if (!deliveryDate) {
      return res.badRequest('Se debe ingresar la fecha de entrega.');
    }

    clientEmployee = parseInt(req.param('clientEmployee'));
    if (!clientEmployee) {
      return res.badRequest('Id del empleado del cliente vacio.');
    }

    initialSuggestedTime = req.param('initialSuggestedTime');
    if (!initialSuggestedTime) {
      return res.badRequest('Debe ingresar una hora inicial de entrega.');
    }

    finalSuggestedTime = req.param('finalSuggestedTime');
    if (!finalSuggestedTime) {
      return res.badRequest('Debe ingresar una hora final de entrega.');
    }

    productsToUpdate = req.param('productsToUpdate');     // Arreglo de productos para actualizar.
    additionalInformation = req.param('additionalInformation');
    updatedAt = TimeZoneService.getDate({});
    deliveryDate = TimeZoneService.getDate({timestamp: deliveryDate})

    // crear las credenciales para actualizar un pedido
    var orderCredentials = {
      delivery_date: deliveryDate,
      initial_suggested_time: initialSuggestedTime,
      final_suggested_time: finalSuggestedTime,
      additional_information: additionalInformation,
    };

    //Obtengo la conección para realizar transacciones
    var connectionConfig = AlternativeConnectionService.getConnection();
    var sql = connectionConfig.sql;

    sql.beginTransaction()
    .then(function() {
      return Order.findOne({
        id: orderId
      });
    })
    .then(function(order) {
      if (order) {
        var deliveryDate = new Date(order.deliveryDate);
        if (!isCorrectUpdatedDate(updatedAt, deliveryDate)|| order.state == "Cancelado" || order.state == "Despachado") {
          throw "Debe actualizar su pedido antes de las 2pm del día siguiente a la entrega";
        }
        if (!isCorrectDeliveryDate(updatedAt, deliveryDate)) {
          throw "La fecha de entrega no es correcta";
        }
        return ClientEmployee.findOne({
          id: clientEmployee
        });
      }
      throw "El pedido no existe";
    })
    .then(function(clientemployee) {
      if (clientemployee) {
        orderCredentials.client_employee = clientemployee.id;
        return sql.select({
          table: 'order_product',
          fields: ['client_product']
        }, {
          order_id: orderId
        });
      }
      throw "El empleado no existe";
    })
    .then(function(orderProducts) {
      var orderProductsIds = [];
      orderProducts.forEach(function(orderProduct, indexOp, listOrderProducts) {
        orderProductsIds.push(orderProduct.client_product);
      })
      productsToUpdate.forEach(function(productToUpdate, indexPtu, productList) {
        var index = orderProductsIds.indexOf(productToUpdate.client_product);
        if (index == -1 || orderProductsIds.length == 0) {
          productToUpdate.order_id = orderId;
          productsToAdd.push(productToUpdate);
          // productList.splice(indexPtu, 1);
        } else {
          orderProductsIds.splice(index, 1);
          productsOrdered.push(productToUpdate);
        }
      });
      productsToRemove = orderProductsIds;
      return sql.update('order', orderCredentials, {
        id: orderId
      });
    })
    .then(function(order) {
      if (productsToRemove.length != 0) {
        productsToRemove.forEach(function(productToRemove, index, listProductsToRemove) {
          var product = {
            client_product: productToRemove
          }
          return sql.delete('order_product', product)
          .then(function(orderProduct) {

          })
          .catch(function() {
            throw "Error al borrar un productos"
          })
        })
      }
    })
    .then(function(orderProduct) {
      if (productsOrdered.length != 0) {
        productsOrdered.forEach(function(productOrdered, index, listProductsOrdered) {
          return sql.update('order_product', productOrdered, {
            client_product: productOrdered.client_product,
            order_id: orderId
          })
          .then(function(orderProduct) {

          })
          .catch(function() {
            throw "Error al actualizar un productos"
          })
        })
      }
    })
    .then(function(orderProduct) {
      if (productsToAdd.length != 0) {
        return sql.insert('order_product', productsToAdd);
      }
    })
    .then(function(orderProduct) {
      sql.commit();
      connectionConfig.connection.end(function(err) {
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
      sql.rollback(function(err) {
        connectionConfig.connection.end(function(err) {
          if (err) {
            sails.log.debug(err);
          }
        });
        res.serverError(err);
      });
    });
  },
  /**
  * Funcion para actualizar la fecha de entrega de un pedido.
  * @param  {Object} req Request object
  * @param  {Object} res Response object
  * @return {Object}
  */
  updateDeliveryDate: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    //El formato de fecha es yyyy-mm-dd. mm = 0-11
    var deliveryDate = null;
    var orderIds = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    var deliveryDate = req.param('deliveryDate');
    if (!deliveryDate) {
      return res.badRequest('Se debe ingresar la fecha de entrega.');
    }

    orderIds = req.param('orderIds');
    if (orderIds.length == 0) {
      return res.badRequest('Ids de los pedidos vacio.');
    }
    if (Array.isArray(orderIds)) {
      orderIds.forEach(function(orderId, i, orderIds) {
        orderId = parseInt(orderId);
      })
    }

    deliveryDate = TimeZoneService.getDate({timestamp: deliveryDate});
    //Verifica que la orden exista. Si existe cambia el campo fecha de entrega con el nuevo valor enviado
    Order.find({id: orderIds})
    .then(function(order) {
      return Order.update(orderIds, {
        deliveryDate: deliveryDate,
        state: "Confirmado",
      });
    })
    .then(function(orders) {
      if (Array.isArray(orderIds)) {
        orderIds.forEach(function(orderId, i, orderIds) {
          var job = schedule.scheduledJobs[orderId.toString()];
          if (job) {
            job.cancel();
          }
        })
      } else {
        var job = schedule.scheduledJobs[orderIds.toString()];
        if (job) {
          job.cancel();
        }
      }
      res.ok(orders)
    })
    .catch(function(err) {
      res.serverError(err);
    })
  },
  /**
  * Funcion para cambiar el estado de un pedido.
  * @param  {Object} req Request object
  * @param  {Object} res Response object
  * @return {Object}
  */
  changeState: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var orderIds = null;
    var newState = null;
    var states = ["confirmado", "pendiente de confirmación", "alistado", "despachado", "cancelado"];

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    orderIds = req.param('orderIds');
    if (orderIds.length == 0) {
      return res.badRequest('Ids de los pedidos vacio.');
    }
    newState = req.param("newState");
    if (!newState) {
      return res.badRequest('Se debe ingresar el nuevo estado.');
    }
    if (states.indexOf(newState.toLowerCase()) == -1) {
      return res.badRequest("El estado no existe");
    }
    if (Array.isArray(orderIds)) {
      orderIds.forEach(function(orderId, i, orderIds) {
        orderId = parseInt(orderId);
      })
    }
    //Verifica que la orden exista. Si existe cambia el campo estado con el nuevo valor enviado
    Order.find({
      id: orderIds
    })
    .then(function(orders) {
      // if (orders.length != orderIds.length) {
      //   throw "Una de las ordenes no existe";
      // }
      return Order.update(orderIds, {
        state: newState
      });
    })
    .then(function(orders) {
      res.ok(orders);
    })
    .catch(function(err) {
      res.serverError(err);
    })
  },
  /**
  * Funcion para cancelar un pedido.
  * @param  {Object} req Request object
  * @param  {Object} res Response object
  * @return {Object}
  */
  cancelOrder: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var orderId = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    orderId = parseInt(req.param('orderId'));
    if (!orderId) {
      return res.badRequest('Id del pedido vacio.');
    }

    //Verifica que la orden exista. Si existe actualiza el campo estado a cancelado.
    Order.find({
      id: orderId
    })
    .then(function(order) {
      if (!order) {
        throw "La orden no existe";
      }
      return Order.update(orderId, {
        state: 'Cancelado'
      });
    })
    .then(function(order) {
      res.ok(order[0]);
    })
    .catch(function(err) {
      res.serverError(err);
    })
  },
  /**
  * Funcion para obtener los pedidos dado una fecha de entrega.
  * @param  {Object} req Request object
  * @param  {Object} res Response object
  * @return {Object}
  */
  getByDeliveryDate: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var deliveryDate = null
    var initialDate = null;
    var finalDate = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    var deliveryDateString = req.param('deliveryDate');
    if (!deliveryDateString) {
      return res.badRequest('Se debe ingresar la fecha de entrega.');
    }

    var dataDate = parseInt(deliveryDateString);
    initialDate = TimeZoneService.getDate({timestamp: dataDate});
    initialDate.setUTCHours(0);
    initialDate.setUTCMinutes(0);
    initialDate.setUTCSeconds(0);
    initialDate.setUTCMilliseconds(0);
    finalDate = TimeZoneService.getDate({timestamp: dataDate});
    finalDate.setUTCHours(23);
    finalDate.setUTCMinutes(59);
    finalDate.setUTCSeconds(59);
    finalDate.setUTCMilliseconds(999);
    deliveryDate = [initialDate.toISOString(), finalDate.toISOString()];

    Order.query('SELECT orders.id, orders.created_at, orders.delivery_date, orders.state, orders.initial_suggested_time, \
    orders.final_suggested_time, orders.additional_information, client_employee.name as employeeName, client.trade_name, client.business_phonenumber, \
    address.country, address.department, address.city, address.neighborhood, address.nomenclature, address.additional_information as referencia, \
    product.short_name, order_product.amount, order_product.baked \
    FROM `order` as orders \
    LEFT JOIN client_employee ON orders.client_employee = client_employee.id \
    LEFT JOIN client ON orders.client = client.id \
    LEFT JOIN address ON client.delivery_address = address.id \
    LEFT JOIN order_product ON order_product.order_id = orders.id \
    LEFT JOIN client_product ON order_product.client_product = client_product.id \
    LEFT JOIN product ON client_product.product = product.code \
    WHERE orders.delivery_date >= ? AND orders.delivery_date <= ? order by orders.id', deliveryDate,
    function(err, orders) {
      if (err) {
        return res.serverError(err);
      }
      var arrayOrders = [];
      var orderTmp = null;
      orders.forEach(function(order, index, orders) {
        var orderId = order.id.toString();
        var short_name = order.short_name;
        var amount = order.amount;
        var baked = order.baked;
        delete order.short_name;
        delete order.amount;
        delete order.baked;

        if (!orderTmp) {
          orderTmp = order;
          orderTmp.products = [];
          arrayOrders.push(orderTmp);
        }

        orderTmp.products.push({
          short_name: short_name,
          amount: amount,
          baked: baked
        });

        if (orders[index + 1] && orders[index + 1].id.toString() != orderId) {
          orderTmp = null;
        }
      });
      res.ok(arrayOrders);
    })
  },
  /**
  * Funcion para obtener el estado de un pedido.
  * @param  {Object} req Request object
  * @param  {Object} res Response object
  * @return {Object}
  */
  getState: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var orderId = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    orderId = parseInt(req.param('orderId'));
    if (!orderId) {
      return res.badRequest('Id de la orden vacio.');
    }

    //Verifica que la orden exista. Si existe, obtiene su estado;
    Order.findOne({
      id: orderId
    })
    .then(function(order) {
      if (!order) {
        throw "La orden no existe";
      }
      res.ok({
        id: order.id,
        State: order.state
      });
    })
    .catch(function(err) {
      res.serverError(err);
    })
  },
  /**
  * Funcion para obtener los pedidos por cliente.
  * @param  {Object} req Request object
  * @param  {Object} res Response object
  * @return {Object}
  */
  getByClient: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var user = req.user;

    Client.findOne({
      user: user.id
    })
    .then(function(client) {
      return Order.find({
        client: client.id
      }).sort('createdAt DESC');
    })
    .then(function(order) {
      res.ok(order);
    })
    .catch(function(err) {
      res.serverError();
    })
  },
  /**
  * Funcion para obtener los pedidos por cliente.
  * @param  {Object} req Request object
  * @param  {Object} res Response object
  * @return {Object}
  */
  getProductionAfterDate: function(req, res) {
    var timestamp = req.param('timestamp');

    var today = null;
    var tomorrow = null;
    var todayStr = null;
    var tomorrowStr = null;

    var productList = [];
    var currentCode = null;
    var lastCode = null;
    var product = null;
    var day = null;

    // Bad request: Code 1 = required parameter is null or undefined.
    if (!timestamp) {
      return res.badRequest({code: 1, msg: 'Missing timestamp'});
    }

    timestamp = parseInt(timestamp, 10);

    today = TimeZoneService.getDate({timestamp: timestamp});
    tomorrow = new Date(today.getTime());
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    todayStr = TimeZoneService.createFullDateFormat({dateObject: today});

    var queryStr = "SELECT \
    p.code, p.name , p.short_name as shortName, \
    o.delivery_date AS deliveryDate, \
    op.amount, op.baked \
    FROM \
    product p, `order` o, order_product op, client_product cp \
    WHERE \
    o.id = op.order_id AND cp.id = op.client_product AND p.code = cp.product \
    AND o.delivery_date >= ? \
    ORDER BY p.code;"

    todayStr = TimeZoneService.createDateFormat({dateObject: today});
    tomorrowStr = TimeZoneService.createDateFormat({dateObject: tomorrow});

    Order.query(queryStr, [todayStr], function(err, rows) {
      if (err) {return res.serverError(err);}

      rows.forEach(function(row, index, rows) {
        currentCode = row.code;
        if (currentCode != lastCode) {
          lastCode = currentCode;

          product = {
            code: row.code,
            name: row.name,
            shortName: row.shortName,
            total: 0,
            today: {date: todayStr, baked: 0, frozen: 0},
            tomorrow: {date: tomorrowStr, baked: 0, frozen: 0},
            otherDays: {date: tomorrowStr, baked: 0, frozen: 0}
          };
          productList.push(product);
        }

        if (row.deliveryDate.toISOString().includes(todayStr)) {
          day = product.today;
        } else if (row.deliveryDate.toISOString().includes(tomorrowStr)) {
          day = product.tomorrow;
        } else {
          day = product.otherDays;
        }

        if (row.baked) {
          day.baked += row.amount;
        } else {
          day.frozen += row.amount;
        }
        product.total += row.amount;

      });
      return res.ok(productList);
    });
  },
  /**
  * Funcion para obtener los pedidos por cliente.
  * @param  {Object} req Request object
  * @param  {Object} res Response object
  * @return {Object}
  */
  getProductsSelected: function(req, res) {
    //Declaración de variables
    var orderId = null;
    var product = null;
    var tmpProduct = null;
    var products = [];
    var item = null;
    var orderProductQueryStr =
    'SELECT ' +
    'cp.id, cp.custom_name, cp.product, ' +
    'op.baked, op.amount, op.client_product,' +
    'p.name, p.short_name, ' +
    'i.value, i.short_value, ' +
    'e.name AS element_name ' +
    'FROM product AS p, item_product AS ip, item AS i, element AS e, client_product AS cp, order_product AS op ' +
    'WHERE cp.product = p.code AND ip.product_code = p.code AND ip.item_id = i.id AND i.element = e.id AND op.client_product = cp.id AND op.order_id = ? ' +
    'ORDER BY cp.product; ';

    // Se obtiene el id del pedido.
    orderId = parseInt(req.param('orderId'));
    if (!orderId) {
      return res.badRequest('El pedido no es valido.');
    }

    // Se verifica que el pedido exista, en caso de que no exista
    // se retorna un error. En caso de que exista se obtiene los productos que se le seleccionaron.
    Order.findOne({
      id: orderId
    })
    .then(function(order) {
      Product.query(orderProductQueryStr, order.id,
        function(err, rawData) {
          if (err) {
            sails.log.debug(err);
            throw {
              code: 1,
              msg: 'Query error.'
            };
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

            if (!dataArray[i + 1]) {
              product = {
                id: data.id,
                clientId: data.client,
                customName: data.custom_name,
                amount: data.amount,
                baked: data.baked,
                product: tmpProduct
              }
              products.push(product);
            } else if (dataArray[i + 1].product != tmpProduct.code) {
              product = {
                id: data.id,
                clientId: data.client,
                customName: data.custom_name,
                amount: data.amount,
                baked: data.baked,
                product: tmpProduct
              }
              products.push(product);
              tmpProduct = null;
            }
          })
          return res.ok(products)
        });
      })
      .catch(function(err) {
        if (err.code == 1) {
          return res.serverError();
        }
      });;

    },

    /**
    * Funcion para validar la hora para editar un pedido.
    * @param  {Object} req Request object
    * @param  {Object} res Response object
    * @return {Object}
    */
    validateDateToUpdate: function(req, res) {
      // Declaración de variables
      var orderId = null;
      var today = null;
      var deliveryDate = null;

      // Definición de variables apartir de los parametros de la solicitud y validaciones.
      orderId = parseInt(req.param('orderId'));
      if (!orderId) {
        return res.badRequest('Id del pedido vacio.');
      }

      today = TimeZoneService.getDate({});

      Order.findOne({
        id: orderId
      })
      .then(function(order) {
        sails.log.debug(order)
        deliveryDate = new Date(order.deliveryDate);
        var isCorrectDate = isCorrectUpdatedDate(today, deliveryDate);
        if (!isCorrectDate || order.state == "Cancelado" || order.state == "Despachado") {
          throw {
            code: 1,
            msg: "Error in update date validation."
          };
        } else {
          res.ok();
        }
      })
      .catch(function(err) {
        res.serverError(err);
      })
    },
    /**
    * Funcion para validar la hora para editar un pedido.
    * @param  {Object} req Request object
    * @param  {Object} res Response object
    * @return {Object}
    */
    validateStateToCancel: function(req, res) {
      // Declaración de variables
      var orderId = null;

      // Definición de variables apartir de los parametros de la solicitud y validaciones.
      orderId = parseInt(req.param('orderId'));
      if (!orderId) {
        return res.badRequest('Id del pedido vacio.');
      }

      Order.findOne({
        id: orderId
      })
      .then(function(order) {
        if (order.state == "Despachado" || order.state == "Cancelado") {
          throw {
            code: 1,
            msg: "Error in state validation."
          };
        } else {
          res.ok();
        }
      })
      .catch(function(err) {
        res.serverError();
      })
    },
  };

  function isCorrectUpdatedDate(updatedAt, deliveryDate) {
    var deliveryYear = deliveryDate.getUTCFullYear()
    var deliveryMonth = deliveryDate.getUTCMonth();
    var deliveryDay = deliveryDate.getUTCDate();
    var updatedTime = updatedAt.getUTCHours();
    var updatedYear = updatedAt.getUTCFullYear();
    var updatedMonth = updatedAt.getUTCMonth();
    var updatedDay = updatedAt.getUTCDate();
    var yesterderToDeliveryDate = new Date(deliveryYear, deliveryMonth, deliveryDay);
    yesterderToDeliveryDate.setUTCDate(deliveryDay - 1);
    var isCorrect = true;
    if (deliveryYear > updatedYear) {
      return isCorrect;
    }
    if ((updatedMonth > deliveryMonth) ||(updatedMonth == deliveryMonth && updatedDay >= deliveryDay) ||
    (updatedMonth == yesterderToDeliveryDate.getUTCMonth() && updatedDay == yesterderToDeliveryDate.getUTCDate() && updatedTime > 13) ) {
      isCorrect = false;
    }
    return isCorrect;
  }
  if ((updatedMonth > deliveryMonth) || (updatedMonth == deliveryMonth && updatedDay >= deliveryDay) ||
  (updatedMonth == yesterderToDeliveryDate.getUTCMonth() && updatedDay == yesterderToDeliveryDate.getUTCDate() && updatedTime > 13)) {
    isCorrect = false;
  }
  return isCorrect;
}

function isCorrectDeliveryDate(createdAt, deliveryDate) {
  var createdYear = createdAt.getUTCFullYear();
  var createdTime = createdAt.getUTCHours();
  var createdDay = createdAt.getUTCDate();
  var createdMonth = createdAt.getUTCMonth();
  var deliveryYear = deliveryDate.getUTCFullYear();
  var deliveryDay = deliveryDate.getUTCDate();
  var deliveryMonth = deliveryDate.getUTCMonth();
  var isCorrect = true;
  if (deliveryYear > createdYear) {
    return isCorrect;
  }

  if (deliveryMonth < createdMonth || (createdTime > 3 && deliveryDay <= createdDay && deliveryMonth <= createdMonth) ||
  deliveryDate.getUTCDay() == 0) {
    isCorrect = false;
  }
  return isCorrect;
}

function validateDeliveryDateDesired(createdAt, deliveryDate) {
  var createdTime = createdAt.getUTCHours();
  var createdYear = createdAt.getUTCFullYear();
  var createdMonth = createdAt.getUTCMonth();
  var createdDay = createdAt.getUTCDate();
  var deliveryYear = deliveryDate.getUTCFullYear();
  var deliveryMonth = deliveryDate.getUTCMonth();
  var deliveryDay = deliveryDate.getUTCDate();
  var tomorrow = new Date(createdYear, createdMonth, createdDay);
  tomorrow.setDate(createdDay + 1);
  var afterTomorrow = new Date(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate() + 1);
  var correct = true;

  if (deliveryYear > createdYear) {
    return correct;
  }
  if (((createdTime > 13 && createdTime < 23) && deliveryMonth == tomorrow.getUTCMonth() && (deliveryDay == tomorrow.getUTCDate() ||
  (tomorrow.getUTCDay() == 0 && afterTomorrow.getUTCDate() == deliveryDay ))) ||
    ((createdTime >= 0 && createdTime < 4) && deliveryDay == createdDay && deliveryMonth == createdMonth)) {
      correct = false;
    }
    return correct;
  }
