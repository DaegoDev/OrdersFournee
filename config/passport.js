// Obtenemos las librerias necesarias de passport para la authenticación y autorizaciión

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;


// Configuración de JwtStrategy

var EXPIRES_IN_MINUTES = 60 * 60 * 15;
var SECRET = process.env.tokenSecret
    || "gDDX7NnKuqDnvK87jROA0MDtATKvJ9jfb2NRE4E7uazqdlwR5P7Uu8veBWkUsG9";
var ALGORITHM = "HS256";
var ISSUER = "lafournee.com.co";
var AUDIENCE = "lafournee.com.co";
var EXTRACT_JWT = ExtractJwt.fromAuthHeader();

var JWT_STRATEGY_CONFIG = {
  jwtFromRequest: EXTRACT_JWT,
  secretOrKey: SECRET,
  issuer: ISSUER,
  audience: AUDIENCE,
  passReqToCallback: false
};

// Trigger el cual se activa cuando un usuario se identifica mediante JwtStrategy

function _onJwtStrategyAuth(payload, next) {
  var user = payload.user;
  return next(null, user, {});
};

// Configuración de LocalStrategy para un usuario

var LOCAL_USER_CONFIG = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: false
};

// Trigger el cual se activa  cuando un usuario se identifica mediante LocalStrategy
function _onLocalUser(username, password, next) {
  if (!username) {
    next(null, false, {
      code: 'E_NO_USERNAME',
      message: 'No se ha ingresado un nombre de usuario valido.'
    });
  }
  if (!password) {
    next(null, false, {
      code: 'E_NO_PASSWORD',
      message: 'Debe ingresar una contraseña'
    });
  }
  User.findOne({username: username})
    .exec(function(error, registro) {
      if (error) {
        return next(error, false, {});
      } else if (!registro) {
        return next(null, false, {
          code: 'E_USERNAME_NOT_FOUND',
          message: username + ' not found'
        });
      } else if (!registro.state) {
        return next(null, false, {
          code: 'E_USER_NOT_ACTIVE',
          message: username + ' not active'
        });
      } else if (!CriptoService.compararHash(password, registro.password)) {
        return next(null, false, {
          code: 'E_WRONG_PASSWORD',
          message: 'Password is wrong'
        });
      }
      return next(null, registro, {});
    });
};

// Registramos en el passport las estrategias previamente configuradas.

passport.use('local-user',new LocalStrategy(LOCAL_USER_CONFIG, _onLocalUser));
passport.use(new JwtStrategy(JWT_STRATEGY_CONFIG, _onJwtStrategyAuth));

// Exportamos nuestra configuracion de JwtStrategy para accederla globalmente.

module.exports.jwtSettings = {
  jwtFromRequest: EXTRACT_JWT,
  expiresInMinutes: EXPIRES_IN_MINUTES,
  secret: SECRET,
  algorithm: ALGORITHM,
  issuer: ISSUER,
  audience: AUDIENCE
};
