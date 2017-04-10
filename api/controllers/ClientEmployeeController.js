/**
 * ClientEmployeeController
 *
 * @description :: Server-side logic for managing clientemployees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Funcion para agregar los empleados autorizados para los pedidos de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  addClientEmployee: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var user = req.user;
    var name = null;
    var state = null;
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

    // Organización de credenciales y cifrado de la contraseña del usuario.
    var clientEmployeeCredentials = {
      name: name,
      phonenumber: phonenumber,
      role: role,
      state: true
    }

    // Se verifica que el usuario exista antes de la creación de los empleados, en caso de que no exista
    // se retorna un error. En caso de que exista se crea el regitro del usuario.
    Client.findOne({user: user.id})
    .then(function(client) {
      sails.log.debug(client)
      if(client){
        clientEmployeeCredentials.client = client.id;
        return ClientEmployee.create(clientEmployeeCredentials);
      }
      throw "El cliente no existe";
    })
    .then(function(clientEmployee) {
      sails.log.debug(clientEmployee);
      res.ok({
        clientEmployee: clientEmployee
      })
    })
    .catch(function(err) {
      sails.log.debug(err);
      res.serverError(err);
    })

  },
  /**
   * Funcion para obtener los empleados autorizados para los pedidos de un cliente.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  getEmployeesByClient: function(req, res) {
    var user = req.user;

    Client.find({ user: user.id})
    .populate('clientEmployee')
    .then(function(client) {
      sails.log.debug(client);
      res.ok({
        employees: client[0].clientEmployee
      })
    })
    .catch(function(err) {
      res.serverError(err);
    })
  }

};
