/**
 * Politica para la autorización de usuario con rol company.
 */

var passport = require('passport');
module.exports = function (req, res, next) {
  passport.authenticate('jwt', function (err, user, info) {
    if (err) {
      return res.serverError();
    } else if (!user) {
      return res.conflict();
    }
    req.user = user;
    next();
  })(req, res);
};
