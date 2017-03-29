/**
 * Politica para la autorización de un usuario valido del sitema.
 * Un usuario valido puede ser cualquier usuario de rol administrador, despachador o cliente
 * que posea un token valido.
 */

var passport = require('passport');
module.exports = function (req, res, next) {
  sails.log.debug("validar autenticacion");
  passport.authenticate('jwt', function (err, user, info) {
    sails.log.debug(user);
  	sails.log.debug(req.user);
    if (err) {
      return res.serverError(err);
    } else if (!user) {
      return res.unauthorized(null, info && info.code, info && info.message);
    }
    req.user = user;
    next();
  })(req, res);
};
