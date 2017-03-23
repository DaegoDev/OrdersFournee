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
    var billCountry = null;
    var billDepartment = null;
    var billCity = null;
    var billNeighborhood = null;
    var billNomenclature = null;
    var billAddrAdditionalInformation = null;
    var deliveryCountry = null;
    var deliveryDepartment = null;
    var deliveryCity = null;
    var deliveryNeighborhood = null;
    var deliveryNomenclature = null;
    var delivAddrAdditionalInformation = null;
		var role = null;
    var username = null;
    var password = null;


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

    username = req.param('username');
    if (!username) {
      return res.badRequest('Se debe ingresar un nombre de usuario.');
    }

    password = req.param('password');
    if (!password) {
      return res.badRequest('Se debe ingresar una contraseña.');
    }

    managerName = req.param('managerName');
    managerPhonenumber = req.param('managerPhonenumber');
    businessPhonenumber = req.param('businessPhonenumber');
    clientAdditionalInformation = req.param('clientAdditionalInformation');
    billCountry = req.param('billCountry');
    billDepartment = req.param('billDepartment');
    billCity = req.param('billCity');
    billNeighborhood = req.param('billNeighborhood');
    billNomenclature = req.param('billNomenclature');
    billAddrAdditionalInformation = req.param('billAddrAdditionalInformation');
    deliveryCountry = req.param('deliveryCountry');
    deliveryDepartment = req.param('deliveryDepartment');
    deliveryCity = req.param('deliveryCity');
    deliveryNeighborhood = req.param('deliveryNeighborhood');
    deliveryNomenclature = req.param('deliveryNomenclature');
    delivAddrAdditionalInformation = req.param('delivAddrAdditionalInformation');

    // Organización de credenciales y cifrado de la contraseña del usuario.
    var userCredentials = createUserCredentials(username, password);
    // Organización de credenciales de la dirección de entrega.
    var billAddressCredentials = createAddressCredentials(billCountry, billDepartment, billCity, billNeighborhood,
                                                          billNomenclature, billAddrAdditionalInformation);
    // Organización de credenciales de la dirección de facturación.
    var deliveryAddressCredentials = createAddressCredentials(deliveryCountry, deliveryDepartment, deliveryCity, deliveryNeighborhood,
                                                              deliveryNomenclature, delivAddrAdditionalInformation);
    // Organización de credenciales del cliente.
    var clientCredentials = createClientCredentials(legalName, nit, tradeName, managerName, managerPhonenumber,
                                                    businessPhonenumber, clientAdditionalInformation);
    var arrayAddressCredentials = [billAddressCredentials, deliveryAddressCredentials];

    //Obtengo la conección para realizar transacciones
    var connectionConfig = AlternativeConnectionService.getConnection();
    var sql = connectionConfig.sql;

    // Se verifica que el usuario no exista antes de su creación, en caso de que exista
    // se retorna un error de conflicto con codigo de error 409. En caso de que no exista
    // se crea el regitro del usuario.
    sql.beginTransaction()
      .then(function() {
        return sql.select('user', {
          username: username
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
        sails.log.debug(arrayAddressCredentials);
        return sql.insert('address', arrayAddressCredentials);
      })
      .then(function(insertedAddresses) {
        clientCredentials.bill_address = insertedAddresses.insertId;
        clientCredentials.delivery_address = insertedAddresses.insertId + 1;
        return sql.insert('client', clientCredentials);
      })
      .then(function(user) {
        sql.commit();
        connectionConfig.connection.end(function(err) {
          if (err) {
            sails.log.debug(err);
          }
        });
        res.created({
          user: user
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
    Client.findOne({id: clientId})
    .then(function(client) {
      if (client) {
        return User.update({id: client.user}, {state: false});
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
    var clientId = null;
    var currentPassword = req.param('currentPassword');
		var newPassword = req.param('newPassword');

    // Definición de la variable id, apartir de los parametros de la solicitud y validaciones.
    clientId = parseInt(req.param('clientId'));
    if (!clientId) {
      return res.badRequest('Id del cliente vacio.');
    }
    // valida si existe el cliente con el ese id, si existe cambia la contraseña de su usuario en false
    Client.findOne({id: clientId})
    .populate('user')
		.then(function(client) {
			if (CriptoService.compararHash(currentPassword, client.user.password)) {
				newPassword = CriptoService.hashValor(newPassword);
				return User.update({id: client.user.id}, {password: newPassword});
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
    products = ["1A","2B","4B"];

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
    products = ["1A"];

    // Valida que el cliente si exista, en caso de que si añade los preductos habilitados para él,
    // en caso de que no, envia el mensaje de error
    Client.findOne(clientId)
    .then(function(client) {
      if (client) {
        client.products.remove(products);
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
};
// crea las credenciales para insertar una dirección
function createAddressCredentials(country, department, city, neighborhood, nomenclature, additionalInformation) {
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
function createClientCredentials(legalName, nit, tradeName, managerName,managerPhonenumber, businessPhonenumber, additionalInformation) {
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
