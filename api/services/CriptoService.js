/**
* CriptoService.js
*
* @description :: Server-side logic for managing authorization.
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

/**
*  Librerias utilizadas para la autorización y el cifrado de datos.
*/
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports = {
  // Obtenemos la configuración del JwtStrategy
  secret: sails.config.jwtSettings.secret,
  issuer: sails.config.jwtSettings.issuer,
  audience: sails.config.jwtSettings.audience,

  /**
  * Función para cifrar un dato ingresado como argumento.
  * @param  {String} valor Dato que se desea cifrar.
  * @return {String}       Retorna el dato cifrado.
  */
  hashValor: function (valor) {
    if (!valor) {
      return null;
    }
    return bcrypt.hashSync(valor);
  },

  /**
  * Función para comparar un dato cifrado con otro dato el cual aún no ha sido cifrado.
  * @param  {String} valor1 Dato el cual no ha sido cifrado.
  * @param  {String} valor2 Dato cifrado contra el cual se desea comparar otro dato.
  * @return {bool}        Retorna true si los dos dato ingresados son equivalentes,
  *                               retorna falso de lo contrario.
  */
  compararHash: function (valor1, valor2) {
    return bcrypt.compareSync(valor1, valor2);
  },

  /**
  * Función para generar un token de autorización.
  * @param  {Object} user Objeto usado dentro del payload para la validación y
  *                       generación de un token.
  * @return {String}      Retorna un string el cual corresponde a el token generado.
  */
  crearToken: function (user) {
    delete user.password;
    return jwt.sign({
      // Payload
      user: user.toJSON()
    },
    // Jwt secret
    sails.config.jwtSettings.secret,
    // Jwt Options
    {
      algorithm: sails.config.jwtSettings.algorithm,
      expiresIn: sails.config.jwtSettings.expiresInMinutes,
      issuer: sails.config.jwtSettings.issuer,
      audience: sails.config.jwtSettings.audience
    });
  },

  /**
  * Función para generar un token de validacion para la recuperación de una contraseña.
  * @param  {Object} payload Objeto usado la validación y generación de un token.
  * @return {String}      Retorna un string el cual corresponde a el token generado.
  */
  crearTokenRecuperacion: function (user) {
    return jwt.sign({
      // Payload
      user: user
    },
    // Jwt secret
    sails.config.jwtSettings.secret,
    // Jwt Options
    {
      algorithm: sails.config.jwtSettings.algorithm,
      expiresIn: 60 * 5,
      issuer: sails.config.jwtSettings.issuer,
      audience: sails.config.jwtSettings.audience
    });
  },

  /**
  * Función para generar una hilera de caracteres de forma aleatoria.
  * @param  {Object} longitud Cantidad de caracteres que tendrá la hilera generada.
  * @return {String}      Retorna un string el cual corresponde a la hilera generada.
  */
  generarString: function (longitud) {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWXYZ!¡@#$%&^*+-()<>1234567890";
    var string = '';
    var j = 0;
    for (var i = 0; i < longitud; i++) {
        j = Math.floor(Math.random() * chars.length);
        string += chars.charAt(j);
      }
      return string;
    }
};
