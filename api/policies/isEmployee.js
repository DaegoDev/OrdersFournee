/**
 * Politica para la autorización de usuario con rol comité, jefe o profesor.
 */

var passport = require('passport');
module.exports = function (req, res, next) {
  passport.authenticate('jwt', function (err, user, info) {
    var role = null;

    if (err) {
      return res.serverError();
    } else if (!user) {
      return res.unauthorized(null, info && info.code, info && info.message);
    }

    role = user.role;
    if (role.toLowerCase() === 'despachador' || role.toLowerCase() === 'admin') {
      req.user = user;
      next();
    } else {
      return res.unauthorized(null, info && info.code, info && info.message);
    }
  })(req, res);
};
