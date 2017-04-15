/**
 * EmployeeController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Funcion para registrar un empleado.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  signup: function(req, res) {
    // Inicialización de variables necesarias. los parametros necesarios viajan en el cuerpo
    // de la solicitud.
    var name = null;
    var role = null;
    var username = null;
    var password = null;

    // Definición de variables apartir de los parametros de la solicitud y validaciones.
    name = req.param('name');
    if (!name) {
      return res.badRequest('Se debe ingresar un nombre.');
    }

    role = req.param('role');
    if (!role) {
      return res.badRequest('Se debe ingresar un rol.');
    }

    username = req.param('username');
    if (!username) {
      return res.badRequest('Se debe ingresar un nombre de usuario.');
    }

    password = req.param('password');
    if (!password) {
      return res.badRequest('Se debe ingresar una contraseña.');
    }

    // Organización de credenciales y cifrado de la contraseña del usuario.
    password = CriptoService.hashValor(password);
    var userCredentials = {
      username: username,
      password: password,
      role: role,
      state: true
    };

    // Organización de credenciales del empleado.
    var employeeCredentials = {
      name: name,
    };

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
        employeeCredentials.user = newUser.insertId;
        return sql.insert('employee', employeeCredentials)
      })
      .then(function(user) {
        sql.commit();
        connectionConfig.connection.end(function(err) {
          if (err) {
            sails.log.debug(err);
          }
        });
        res.created(user);
      })
      .catch(function(err) {
        sql.rollback(function(err) {
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
   * Funcion para borrar un empleado.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  delete: function(req, res) {
    var employeeId = null;
    // Definición de la variable id, apartir de los parametros de la solicitud y validaciones.
    employeeId = parseInt(req.param('employeeId'));
    if (!employeeId) {
      return res.badRequest('Id del empleado vacio.');
    }
    // valida si existe el empleado con el ese id, si existe cambia el estado de su usuario en false
    Employee.findOne({
        id: employeeId
      })
      .then(function(employee) {
        if (employee) {
          return User.update({
            id: employee.user
          }, {
            state: false
          });
        }
        return res.serverError();
      })
      .then(function(user) {
        var userDeleted = user[0];
        return Employee.findOne({user: userDeleted.id});
      })
      .then(function(employee) {
        return res.ok(employee);
      })
      .catch(function(err) {
        res.serverError();
      })
  },
  /**
   * Funcion para actualizar la contraseña.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  updatePassword: function(req, res) {
    var user = req.user;
    var currentPassword = req.param('currentPassword');
    var newPassword = req.param('newPassword');

    // valida si existe el empleado con el ese id, si existe cambia la contraseña de su usuario en false
    Employee.findOne({
        user: user.id
      })
      .populate('user')
      .then(function(employee) {
        if (CriptoService.compararHash(currentPassword, employee.user.password)) {
          newPassword = CriptoService.hashValor(newPassword);
          return User.update({
            id: employee.user.id
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
   * Funcion para obtener el perfil de un empleado.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  getProfile: function(req, res) {
    var user = req.user;
    Employee.find({
        user: user.id
      })
      .then(function(employee) {
        return res.ok(employee[0]);
      })
      .catch(function(err) {
        res.serverError(err)
      });
  },
  /**
   * Funcion para obtener todos los empleados.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   */
  getAll: function(req, res) {
    Employee.find()
      .populate('user')
      .then(function(employees) {
        var employeesArray = [];
        employees.forEach(function(employee, i, employees) {
          var state = null;
          if (employee.user.state) {
            state = "Activo";
          } else {
            state = "Inactivo";
          }
          var response = {
            id: employee.id,
            name: employee.name,
            username: employee.user.username,
            role: employee.user.role,
            state: state
          }
          employeesArray.push(response);
        })
        res.ok(employeesArray);
      })
      .catch(function(err) {
        res.serverError(err);
      })
  }
};
