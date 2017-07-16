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
    var userId = req.user.id;

    var deliveryDateString = req.param('deliveryDate');
    if (!deliveryDateString) {
      return res.badRequest('Se debe ingresar la fecha de entrega.');
    }
    var dataDate = deliveryDateString.split("-", 3);
    deliveryDate = new Date(dataDate[0], dataDate[1], dataDate[2]);

    clientEmployee = parseInt(req.param('clientEmployee'));
    if (!clientEmployee) {
      return res.badRequest('Id del empleado del cliente vacio.');
    }

    initialSuggestedTime = req.param('initialSuggestedTime');
    finalSuggestedTime = req.param('finalSuggestedTime');
    additionalInformation = req.param('additionalInformation');

    createdAt = TimeZoneService.getDateNow({
      offset: -5
    }, null);
    if (!isCorrectDeliveryDate(createdAt, deliveryDate)) {
      return res.badRequest("La fecha de entrega no es correcta");
    }
    state = setState(createdAt, deliveryDate);

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

    // Arreglo de productos para registrar con la pedido
    productsToOrder = req.param('productsToOrder');

    if (typeof productsToOrder == 'string') {
      productsToOrder = [JSON.parse(productsToOrder)];
    } else {
      productsToOrder.forEach(function(product, index, productList) {
        productList[index] = JSON.parse(product);
      });
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
        return sql.insert('order_product', productsToOrder);
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
    var deliveryDateString = req.param('deliveryDate');
    if (!deliveryDateString) {
      return res.badRequest('Se debe ingresar la fecha de entrega.');
    }
    var dataDate = deliveryDateString.split("-", 3);
    deliveryDate = new Date(dataDate[0], dataDate[1], dataDate[2]);

    orderIds = req.param('orderIds');
    if (orderIds.length == 0) {
      return res.badRequest('Ids de los pedidos vacio.');
    }
    if (Array.isArray(orderIds)) {
      orderIds.forEach(function(orderId, i, orderIds) {
        orderId = parseInt(orderId);
      })
    }

    //Verifica que la orden exista. Si existe cambia el campo fecha de entrega con el nuevo valor enviado
    Order.find({
        id: orderIds
      })
      .then(function(order) {
        // if (!order) {
        //   throw "La orden no existe";
        // } else
        // if (!isCorrectDeliveryDate(order.deliveryDate, deliveryDate)) {
        //   throw "La nueva fecha de entrega no es correcta";
        // }
        return Order.update(orderIds, {
          deliveryDate: deliveryDate
        });
      })
      .then(function(orders) {
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
          state: 'cancelado'
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

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    var deliveryDateString = req.param('deliveryDate');
    if (!deliveryDateString) {
      return res.badRequest('Se debe ingresar la fecha de entrega.');
    }
    var dataDate = deliveryDateString.split("-", 3);
    deliveryDate = new Date(dataDate[0], dataDate[1], dataDate[2]);

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
                   WHERE orders.delivery_date = ? order by orders.id', [deliveryDate],
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
            // sails.log.debug(products);
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

    var deliveryDateString = req.param('deliveryDate');
    if (!deliveryDateString) {
      return res.badRequest('Se debe ingresar la fecha de entrega.');
    }
    var dataDate = deliveryDateString.split("-", 3);
    deliveryDate = new Date(dataDate[0], dataDate[1], dataDate[2]);

    clientEmployee = parseInt(req.param('clientEmployee'));
    if (!clientEmployee) {
      return res.badRequest('Id del empleado del cliente vacio.');
    }

    initialSuggestedTime = req.param('initialSuggestedTime');
    finalSuggestedTime = req.param('finalSuggestedTime');
    additionalInformation = req.param('additionalInformation');

    updatedAt = TimeZoneService.getDateNow({
      offset: -5
    }, null);

    // crear las credenciales para actualizar un pedido
    var orderCredentials = {
      delivery_date: deliveryDate,
      initial_suggested_time: initialSuggestedTime,
      final_suggested_time: finalSuggestedTime,
      additional_information: additionalInformation,
    };

    // Arreglo de productos para actualizar.
    productsToUpdate = req.param('productsToUpdate');

    if (typeof productsToUpdate == 'string') {
      productsToUpdate = [JSON.parse(productsToUpdate)];
    } else {
      productsToUpdate.forEach(function(product, index, productList) {
        productList[index] = JSON.parse(product);
      });
    }

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
          if (!isCorrectUpdatedDate(updatedAt, order.createdAt)) {
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
        sails.log.debug(productsOrdered);
        sails.log.debug(productsToAdd);
        sails.log.debug(productsToRemove);
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
   * Funcion para validar la hora para editar un pedido.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  validateDateToUpdate: function(req, res) {
    // Declaración de variables
    var orderId = null;
    var today = null;
    var createdAt = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    orderId = parseInt(req.param('orderId'));
    if (!orderId) {
      return res.badRequest('Id del pedido vacio.');
    }

    today = TimeZoneService.getDateNow({
      offset: -5
    }, null);

    Order.findOne({
        id: orderId
      })
      .then(function(order) {
        createdAt = new Date(order.createdAt);
        var isCorrectDate = isCorrectUpdatedDate(today, createdAt);
        if (!isCorrectDate || order.state == "cancelado") {
          throw "Error";
        } else {
          res.ok();
        }
      })
      .catch(function(err) {
        res.serverError();
      })

  }
};

function isCorrectUpdatedDate(updatedAt, createdAt) {
  var createdDay = createdAt.getDate();
  var createdMonth = createdAt.getMonth();
  var updatedTime = updatedAt.getHours();
  var updatedDay = updatedAt.getDate();
  var updatedMonth = updatedAt.getMonth();
  var isCorrect = true;

  if (updatedMonth != createdMonth || updatedDay != createdDay || updatedTime > 13) {
    isCorrect = false;
  }
  return isCorrect;
}

function isCorrectDeliveryDate(createdAt, deliveryDate) {
  var createdTime = createdAt.getHours();
  var createdDay = createdAt.getDate();
  var createdMonth = createdAt.getMonth();
  var deliveryDay = deliveryDate.getDate();
  var deliveryMonth = deliveryDate.getMonth();
  var isCorrect = true;

  if (deliveryMonth < createdMonth || (createdTime > 3 && deliveryDay <= createdDay) || deliveryDate.getDay() == 0) {
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
