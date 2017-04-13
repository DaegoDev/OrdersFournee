/**
 * ClientController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Funcion para registrar un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  signup: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var legalName = null;
    var nit = null;
    var tradeName = null;
    var managerName = null;
    var managerPhonenumber = null;
    var businessPhonenumber = null;
    var clientAdditionalInformation = null;
    var productsCodes = [];
    var clientProductsCredentials = [];
    // var billCountry = null;
    // var billDepartment = null;
    // var billCity = null;
    // var billNeighborhood = null;
    // var billNomenclature = null;
    // var billAddrAdditionalInformation = null;
    // var deliveryCountry = null;
    // var deliveryDepartment = null;
    // var deliveryCity = null;
    // var deliveryNeighborhood = null;
    // var deliveryNomenclature = null;
    // var delivAddrAdditionalInformation = null;
    var role = null;


    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    legalName = req.param('legalName');
    if (!legalName) {
      return res.badRequest('Se debe ingresar una razon social.');
    }

    nit = req.param('nit');
    if (!nit) {
      return res.badRequest('Se debe ingresar un nit.');
    }

    tradeName = req.param('tradeName');
    if (!tradeName) {
      return res.badRequest('Se debe ingresar el nombre de la empresa.');
    }


    managerName = req.param('managerName');
    managerPhonenumber = req.param('managerPhonenumber');
    businessPhonenumber = req.param('businessPhonenumber');
    clientAdditionalInformation = req.param('clientAdditionalInformation');
    productsCodes = req.param('productCodes');

    // billCountry = req.param('billCountry');
    // billDepartment = req.param('billDepartment');
    // billCity = req.param('billCity');
    // billNeighborhood = req.param('billNeighborhood');
    // billNomenclature = req.param('billNomenclature');
    // billAddrAdditionalInformation = req.param('billAddrAdditionalInformation');
    // deliveryCountry = req.param('deliveryCountry');
    // deliveryDepartment = req.param('deliveryDepartment');
    // deliveryCity = req.param('deliveryCity');
    // deliveryNeighborhood = req.param('deliveryNeighborhood');
    // deliveryNomenclature = req.param('deliveryNomenclature');
    // delivAddrAdditionalInformation = req.param('delivAddrAdditionalInformation');

    // Organización de credenciales y cifrado de la contraseña del usuario.
    var userCredentials = createUserCredentials(legalName, nit);

    // Organización de credenciales de la dirección de entrega.
  //  var billAddressCredentials = createAddressCredentials(billCountry, billDepartment, billCity, billNeighborhood,
  //    billNomenclature, billAddrAdditionalInformation);
    // Organización de credenciales de la dirección de facturación.
  //  var deliveryAddressCredentials = createAddressCredentials(deliveryCountry, deliveryDepartment, deliveryCity, deliveryNeighborhood,
  //    deliveryNomenclature, delivAddrAdditionalInformation);
    // Organización de credenciales del cliente.

    var clientCredentials = createClientCredentials(legalName, nit, tradeName, managerName, managerPhonenumber,
      businessPhonenumber, clientAdditionalInformation);

    //Obtengo la conección para realizar transacciones
    var connectionConfig = AlternativeConnectionService.getConnection();
    var sql = connectionConfig.sql;

    // Se verifica que el usuario no exista antes de su creación, en caso de que exista
    // se retorna un error de conflicto con codigo de error 409. En caso de que no exista
    // se crea el regitro del usuario.
    sql.beginTransaction()
      .then(function() {
        return sql.select('user', {
          username: legalName
        });
      })
      .then(function(user) {
        if (user.length == 0) {
          return sql.insert('user', userCredentials)
        }
        return res.conflict();
      })
      .then(function(newUser) {
        clientCredentials.user = newUser.insertId;
      //   if (billAddressCredentials) {
      //     return sql.insert('address', billAddressCredentials);
      //   }
      //   return null;
      // })
      // .then(function(insertedBillAddress) {
      //   if (insertedBillAddress) {
      //     clientCredentials.bill_address = insertedBillAddress.insertId;
      //   }
      //   if (deliveryAddressCredentials) {
      //     return sql.insert('address', deliveryAddressCredentials);
      //   }
      //   return null;
      // })
      // .then(function(insertedDeliveryAddress) {
      //   if (insertedDeliveryAddress) {
      //     clientCredentials.delivery_address = insertedDeliveryAddress.insertId;
      //   }
        return sql.insert('client', clientCredentials);
      })
      .then(function(client) {
        productsCodes.forEach(function(productCode, i, productsCodes) {
          var clientProduct = {
            client: client.insertId,
            product: productCode
          }
          clientProductsCredentials.push(clientProduct);
        })
        return sql.insert('client_product', clientProductsCredentials);
      })
      .then(function(clientProduct) {
        sql.commit();
        connectionConfig.connection.end(function(err) {
          if (err) {
            sails.log.debug(err);
          }
        });
        res.created({
          username: legalName,
          password: nit
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
   * Funcion para borrar a un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  delete: function(req, res) {
    // Se declara las variables necesarias
    var clientId = null;
    // Definición de la variable id, apartir de los parametros de la solicitud y validaciones.
    clientId = parseInt(req.param('clientId'));
    if (!clientId) {
      return res.badRequest('Id del cliente vacio.');
    }
    // valida si existe el cliente con el ese id, si existe cambia el estado de su usuario en false
    Client.findOne({
        id: clientId
      })
      .then(function(client) {
        if (client) {
          return User.update({
            id: client.user
          }, {
            state: false
          });
        }
        return res.serverError();
      })
      .then(function(user) {
        return res.ok();
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError();
      })
  },

  /**
   * Funcion para actualizar la contraseña de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  updatePassword: function(req, res) {
    // Se declara las variables necesarias para actualizar la contraseña de un cliente
    var user = req.user;
    var currentPassword = req.param('currentPassword');
    var newPassword = req.param('newPassword');

    // valida si existe el cliente con el ese id, si existe cambia la contraseña de su usuario en false
    Client.findOne({
        user: user.id
      })
      .populate('user')
      .then(function(client) {
        if (CriptoService.compararHash(currentPassword, client.user.password)) {
          newPassword = CriptoService.hashValor(newPassword);
          return User.update({
            id: client.user.id
          }, {
            password: newPassword
          });
        }
      })
      .then(function(user) {
        return res.ok();
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError();
      });
  },

  /**
   * Funcion para registrar los productos habilitados para un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  enableProduct: function(req, res) {
    // se declara el id del cliente y el arreglo de productos
    var clientId = null;
    var products = [];

    // Definición de la variable id, apartir de los parametros de la solicitud y validaciones.
    clientId = parseInt(req.param('clientId'));
    if (!clientId) {
      return res.badRequest('Id del cliente vacio.');
    }
    products = req.param('products');

    // Valida que el cliente si exista, en caso de que si añade los preductos habilitados para él,
    // en caso de que no, envia el mensaje de error
    Client.findOne(clientId)
      .then(function(client) {
        if (client) {
          client.products.add(products);
          return client.save();
        }
        return res.serverError();
      })
      .then(function(client) {
        res.ok({
          client: client
        })
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError();
      })
  },
  /**
   * Funcion para deshabilitar los productos de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  disableProduct: function(req, res) {
    // se declara el id del cliente y el arreglo de productos
    var clientId = null;
    var products = [];

    // Definición de la variable id, apartir de los parametros de la solicitud y validaciones.
    clientId = parseInt(req.param('clientId'));
    if (!clientId) {
      return res.badRequest('Id del cliente vacio.');
    }
    product = req.param('product');

    // Valida que el cliente si exista, en caso de que si añade los preductos habilitados para él,
    // en caso de que no, envia el mensaje de error
    Client.findOne(clientId)
      .then(function(client) {
        if (client) {
          client.products.remove(product);
          return client.save();
        }
        return res.serverError();
      })
      .then(function(client) {
        sails.log.debug(client);
        res.ok({
          client: client
        })
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError();
      })
  },
  /**
   * Funcion para obtener el perfil de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  getProfile: function(req, res) {
    var user = req.user;
    Client.find({
        user: user.id
      })
      .populate('billAddress')
      .populate('deliveryAddress')
      .then(function(client) {
        // sails.log.debug(client);
        return res.ok(client[0]);
      })
      .catch(function(err) {
        res.serverError(err)
      });
  },
  /**
   * Funcion para obtener los productos habilitados a un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  getProductsEnabled: function(req, res) {
    // Declaración de variables
    var clientId = null;

    // Definición de la variable id, apartir de los parametros de la solicitud y validaciones.
    clientId = parseInt(req.param('clientId'));
    if (!clientId) {
      return res.badRequest('Id del cliente vacio.');
    }

    // Valida que el cliente si exista, en caso de que si, obtiene los preductos habilitados para él,
    // en caso de que no, envia el mensaje de error
    Client.findOne(clientId)
      .then(function(client) {
        if (client) {
          return ClientProduct.find({
            client: clientId
          }).populate('product');
        }
        return res.serverError();
      })
      .then(function(clientProducts) {
        res.ok({
          clientProducts: clientProducts
        })
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError();
      })
  },
  /**
   * Funcion para obtener validar que el cliente tenga toda la información en la base de datos.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  validateInformation: function(req, res) {
    // Obtiene el id del usuario desde la petición
    var user = req.user;
    // Obtiene el cliente dado el usuario y valida que todos los campos no sean nulos
    Client.query('SELECT * FROM client WHERE client.user = ?', [user.id], function(err, clients) {
      if (err) {
        return res.serverError(err);
      }
      var client = clients[0];
      for (var field in client) {
        if (!client[field]) {
          return res.ok(false);
        }
      }
      ClientEmployee.find()
      .then(function(clientEmployees) {
        if(clientEmployees.length == 0){
          res.ok(false);
        }
        res.ok(true);
      })
      .catch(function(err) {
        res.serverError(err);
      })
    })
  },
  /**
   * Funcion para obtener todos los clientes.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  getAll: function(req, res) {
    Client.find()
      .populate('billAddress')
      .populate('deliveryAddress')
      .populate('clientEmployee')
      .populate('user')
      .then(function(clients) {
        clients.forEach(function (client, i) {
          delete clients[i].user.password
        });
        return res.ok(clients);
      })
      .catch(function(err) {
        res.serverError(err)
      });
  }

};
// crea las credenciales para insertar una dirección
function createAddressCredentials(country, department, city, neighborhood, nomenclature, additionalInformation) {
  if (!country || !department || !city || !neighborhood || !nomenclature) {
    return null;
  }
  var addressCredentials = {
    country: country,
    department: department,
    city: city,
    neighborhood: neighborhood,
    nomenclature: nomenclature,
    additional_information: additionalInformation
  };
  return addressCredentials;
}
// crea las credenciales para insertar un usuario
function createUserCredentials(username, password) {
  password = CriptoService.hashValor(password);
  var userCredentials = {
    username: username,
    password: password,
    role: "cliente",
    state: true
  };
  return userCredentials;
}
// crea las credenciales para insertar un cliente
function createClientCredentials(legalName, nit, tradeName, managerName, managerPhonenumber, businessPhonenumber, additionalInformation) {
  var clientCredentials = {
    legal_name: legalName,
    nit: nit,
    trade_name: tradeName,
    manager_name: managerName,
    manager_phonenumber: managerPhonenumber,
    business_phonenumber: businessPhonenumber,
    additional_information: additionalInformation
  };
  return clientCredentials;
}
