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
    var ownerName = null;
    var ownerPhonenumber = null;
    var businessPhonenumber = null;
    var clientAdditionalInformation = null;
    var productsCodes = [];
    var clientProductsCredentials = [];
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


    ownerName = req.param('ownerName');
    ownerPhonenumber = req.param('ownerPhonenumber');
    businessPhonenumber = req.param('businessPhonenumber');
    clientAdditionalInformation = req.param('clientAdditionalInformation');
    productsCodes = req.param('productCodes');

    // Organización de credenciales y cifrado de la contraseña del usuario.
    var userCredentials = createUserCredentials(legalName, nit);

    var clientCredentials = createClientCredentials(legalName, nit, tradeName, ownerName, ownerPhonenumber,
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
        throw 'El usuario ya existe';
      })
      .then(function(newUser) {
        clientCredentials.user = newUser.insertId;
        return sql.insert('client', clientCredentials);
      })
      .then(function(client) {
        if (productsCodes) {
          if (typeof productsCodes == 'string') {
            var clientProduct = {
              client: client.insertId,
              product: productsCodes
            };
            clientProductsCredentials.push(clientProduct);
          } else {
            productsCodes.forEach(function(productCode, i, productsCodes) {
              var clientProduct = {
                client: client.insertId,
                product: productCode
              }
              clientProductsCredentials.push(clientProduct);
            });
          }
        } else {
          return sql;
        }
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
        } else {
          throw 'Error con contraseña actual';
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
        throw 'El cliente no existe';
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
      .populate('clientEmployee')
      .then(function(client) {
        var profile = client[0];
        delete profile.additionalInformation;
        return res.ok(profile);
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

    // Se obtiene el id del cliente que ejecuta la petición.
    userId = req.user.id;
    if (!userId) {
      return res.badRequest('El usuario no es valido.');
    }

    // Se verifica que el cliente exista, en caso de que no exista
    // se retorna un error. En caso de que exista se obtiene los productos que se le habilitaron.
    Client.findOne({user: userId})
      .then(function (client) {
        Product.query(clientProductQueryStr, client.id,
          function(err, rawData) {
            if(err) {
              sails.log.debug(err);
              throw {code: 1, msg: 'Query error.'};
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
      })
      .catch(function (err) {
        if (err.code == 1) {
          return res.serverError();
        }
      });;

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
      delete client.additional_information;
      for (var field in client) {
        if (!client[field]) {
          return res.ok(false);
        }
      }
      ClientEmployee.find({
          client: client.id
        })
        .then(function(clientEmployees) {
          if (clientEmployees.length == 0) {
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
        return res.ok(clients);
      })
      .catch(function(err) {
        res.serverError(err)
      });
  },
  /**
   * Funcion para actualizar la información general de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  updateGeneralInfo: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var user = null;
    var legalName = null;
    var nit = null;
    var tradeName = null;
    var ownerName = null;
    var ownerPhonenumber = null;
    var businessPhonenumber = null;

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

    ownerName = req.param('ownerName');
    if (!ownerName) {
      return res.badRequest('Se debe ingresar el nombre del administrador.');
    }

    ownerPhonenumber = req.param('ownerPhonenumber');
    if (!ownerPhonenumber) {
      return res.badRequest('Se debe ingresar el telefono del administrador.');
    }

    businessPhonenumber = req.param('businessPhonenumber');
    if (!businessPhonenumber) {
      return res.badRequest('Se debe ingresar el telefono de la empresa.');
    }

    // Organización de credenciales del cliente
    var clientCredentials = {
      legalName: legalName,
      nit: nit,
      tradeName: tradeName,
      ownerName: ownerName,
      ownerPhonenumber: ownerPhonenumber,
      businessPhonenumber: businessPhonenumber
    }
    user = req.user;
    Client.update({
        user: user.id
      }, clientCredentials)
      .then(function(userUpdated) {
        res.ok(userUpdated[0]);
      })
      .catch(function(err) {
        res.serverError(err);
      })
  },
  /**
   * Funcion para crear o actualizar la dirección de facturación de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  updateBillAddress: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var user = null;
    var billCountry = null;
    var billDepartment = null;
    var billCity = null;
    var billNeighborhood = null;
    var billNomenclature = null;
    var billAddrAdditionalInformation = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    billCountry = req.param('billCountry');
    if (!billCountry) {
      return res.badRequest('Se debe ingresar el pais.');
    }

    billDepartment = req.param('billDepartment');
    if (!billDepartment) {
      return res.badRequest('Se debe ingresar el departamento.');
    }

    billCity = req.param('billCity');
    if (!billCity) {
      return res.badRequest('Se debe ingresar la cuidad.');
    }

    billNeighborhood = req.param('billNeighborhood');
    if (!billNeighborhood) {
      return res.badRequest('Se debe ingresar el barrio.');
    }

    billNomenclature = req.param('billNomenclature');
    if (!billNomenclature) {
      return res.badRequest('Se debe ingresar la nomenclatura.');
    }

    billAdditionalInformation = req.param('billAdditionalInformation');
    if (!billAdditionalInformation) {
      return res.badRequest('Se debe ingresar un punto de referencia.');
    }

    // Organización de credenciales de la dirección de facturación del cliente
    addressCredentials = {
      country: billCountry,
      department: billDepartment,
      city: billCity,
      neighborhood: billNeighborhood,
      nomenclature: billNomenclature,
      additionalInformation: billAdditionalInformation,
    }

    user = req.user;
    Client.findOne({
        user: user.id
      })
      .then(function(client) {
        var billAddress = client.billAddress;
        if (billAddress == null) {
          return Address.create(addressCredentials);
        } else {
          return Address.update({
            id: billAddress
          }, addressCredentials);
        }
      })
      .then(function(result) {
        if (result.country) {
          return Client.update({
            user: user.id
          }, {
            billAddress: result.id
          });
        }
        res.ok();
      })
      .then(function(client) {
        res.ok();
      })
      .catch(function(err) {
        res.serverError(err);
      })
  },
  /**
   * Funcion para crear o actualizar la dirección de entrega de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  updateDeliveryAddress: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var user = null;
    var deliveryCountry = null;
    var deliveryDepartment = null;
    var deliveryCity = null;
    var deliveryNeighborhood = null;
    var deliveryNomenclature = null;
    var deliveryAdditionalInformation = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    deliveryCountry = req.param('deliveryCountry');
    if (!deliveryCountry) {
      return res.badRequest('Se debe ingresar el pais.');
    }

    deliveryDepartment = req.param('deliveryDepartment');
    if (!deliveryDepartment) {
      return res.badRequest('Se debe ingresar el departamento.');
    }

    deliveryCity = req.param('deliveryCity');
    if (!deliveryCity) {
      return res.badRequest('Se debe ingresar la cuidad.');
    }

    deliveryNeighborhood = req.param('deliveryNeighborhood');
    if (!deliveryNeighborhood) {
      return res.badRequest('Se debe ingresar el barrio.');
    }

    deliveryNomenclature = req.param('deliveryNomenclature');
    if (!deliveryNomenclature) {
      return res.badRequest('Se debe ingresar la nomenclatura.');
    }

    deliveryAdditionalInformation = req.param('deliveryAdditionalInformation');
    if (!deliveryAdditionalInformation) {
      return res.badRequest('Se debe ingresar un punto de referencia.');
    }

    // Organización de credenciales de la dirección de entrega del cliente.
    addressCredentials = {
      country: deliveryCountry,
      department: deliveryDepartment,
      city: deliveryCity,
      neighborhood: deliveryNeighborhood,
      nomenclature: deliveryNomenclature,
      additionalInformation: deliveryAdditionalInformation,
    }

    user = req.user;
    Client.findOne({
        user: user.id
      })
      .then(function(client) {
        var deliveryAddress = client.deliveryAddress;
        if (deliveryAddress == null) {
          return Address.create(addressCredentials);
        } else {
          return Address.update({
            id: deliveryAddress
          }, addressCredentials);
        }
      })
      .then(function(result) {
        if (result.country) {
          return Client.update({
            user: user.id
          }, {
            deliveryAddress: result.id
          });
        }
        return res.ok();
      })
      .then(function(client) {
        res.ok();
      })
      .catch(function(err) {
        res.serverError(err);
      })
  },
  /**
   * Funcion para crear un empleado de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  createClientEmployee: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var user = req.user;
    var name = null;
    var phonenumber = null;
    var role = null;


    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    name = req.param('name');
    if (!name) {
      return res.badRequest('Se debe ingresar un nombre.');
    }

    phonenumber = req.param('phonenumber');
    if (!phonenumber) {
      return res.badRequest('Se debe ingresar un número de telefono.');
    }

    role = req.param('role');
    if (!role) {
      return res.badRequest('Se debe ingresar un rol.');
    }

    // Organización de credenciales.
    var clientEmployeeCredentials = {
      name: name,
      phonenumber: phonenumber,
      state: true,
      role: role,
    };

    Client.findOne({
        user: user.id
      })
      .then(function(client) {
        clientEmployeeCredentials.client = client.id;
        return ClientEmployee.create(clientEmployeeCredentials)
      })
      .then(function(clientEmployee) {
        res.created(clientEmployee);
      })
      .catch(function(err) {
        res.serverError(err);
      })
  },
  /**
   * Funcion para verificar si un cliente existe.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  validateClient: function(req, res) {
    // Se declara las variables necesarias
    var legalName = null;
    var nit = null;
    // Definición de la variable id, apartir de los parametros de la solicitud y validaciones.
    legalName = req.param('legalName');
    if (!legalName) {
      return res.badRequest('Razón social vacio.');
    }
    nit = parseInt(req.param('nit'));
    if (!nit) {
      return res.badRequest('NIT vacio.');
    }
    // valida si existe el cliente con el ese id, si existe cambia el estado de su usuario en false
    Client.findOne({
        legalName: legalName
      })
      .then(function(client) {
        if (client) {
          res.ok(false);
        } else {
          return Client.findOne({
            nit: nit
          });
        }
      })
      .then(function(client) {
        if (client) {
          res.ok(false);
        } else {
          res.ok(true)
        }
      })
      .catch(function(err) {
        sails.log.debug(err);
        res.serverError();
      })
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
function createClientCredentials(legalName, nit, tradeName, ownerName, ownerPhonenumber, businessPhonenumber, additionalInformation) {
  var clientCredentials = {
    legal_name: legalName,
    nit: nit,
    trade_name: tradeName,
    owner_name: ownerName,
    owner_phonenumber: ownerPhonenumber,
    business_phonenumber: businessPhonenumber,
    additional_information: additionalInformation
  };
  return clientCredentials;
}
