/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/**
 *  Librerias utilizadas para la autenticación y autorización.
 */
var passport = require('passport');
/**
 * Callback ejecutato para la autenticación de un usuario.
 * @param  {Object} req  Request object.
 * @param  {Object} res  Response object.
 * @param  {Object} err  Stacktrace de error generado.
 * @param  {Object} user Instancia del usuario encontrado en el proceso de autenticación.
 * @param  {Object} info Stacktrace de informacion generada.
 * @return {Object}      Retorna un json el cual contiene un token de autorización
 *                               y la instancia de usuario encontrada.
 */
function _onPassportAuth(req, res, err, user, info) {
  if (err) {
    return res.serverError(err);
  }
  if (!user) {
    return res.serverError(null, info && info.code, info && info.message);
  }
  return res.ok({
    token: CriptoService.createToken(user),
    role: user.role
  });
}
module.exports = {
  /**
   * Funcion para autenticar a un usuario.
   * @param  {Object} req  Request object.
   * @param  {Object} res  Response object.
   */
  signinUser: function(req, res) {
    passport.authenticate('local-user', _onPassportAuth.bind(this, req, res))(req, res);
  },
  /**
   * Function to request token to recover the user's password.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return
   */
  requestTokenRecovery: function(req, res) {
    var email = req.param('email');
    var code = null;
    var token = null;
    if (!email) {
      return res.badRequest('Correo requerido');
    }

    Client.findOne({
        email: email
      })
      .then(function(client) {
        if (!client) {
          return res.badRequest('El usuario no está registrado');
        }
        code = CriptoService.generateString(15);
        token = CriptoService.createTokenRecovery({
          email: email,
          code: code
        });
        MailerService.sendMailCode(client, code);
        return res.json(token);
      })
      .catch((err) => {
        res.serverError(err)
      });
  },

  /**
   * Function to recover user's password.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return
   */
  recoverPassword: function(req, res) {
    var user = null;
    var email = null;;
    var codeToken = null;
    var code = null;

    user = req.user;
    if (!user) {
      return serverError("Error");
    }

    email = user.email
    codeToken = user.code;
    code = req.param('code');

    if (!email | !codeToken | !code) {
      return res.serverError("Error");
    }

    if (code !== codeToken) {
      return res.badRequest("El codigo ingresado no es invalido.");
    }

    var newPassword = CriptoService.generateString(20);
    var passwordEncrypted = CriptoService.hashValor(newPassword);

    Client.findOne({
        email: email
      })
      .then((client) => {
        return User.update({
          id: client.user
        }, {
          password: passwordEncrypted
        })
      })
      .then(function(user) {
        MailerService.sendMailPassword(email, newPassword);
        res.ok();
      })
      .catch(function(err) {
        res.serverError(err);
      });
  },
};
