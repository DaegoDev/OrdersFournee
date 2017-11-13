module.exports = {
  /**
   * Función para enviar el código para recuperar la contraseña.
   * @param  {Object} user Objeto con los datos del usuario.
   * @param  {String} code Código que se enviará al correo del usuario.
   * @return
   */
  sendMailCode: function(client, code) {
    sails.hooks.email.send("token", {
        code: code,
        tradeName: client.tradeName
      }, {
        to: client.email,
        subject: "Recuperación contraseña LA FOURNEE"
      },
      function(err) { sails.log.debug(err)});
  },
  /**
   * Función para enviar un correo con la nueva contraseña a la empresa que solicitó
   * recuperar la contraseña.
   * @param  {String} email dato que contiene el correo al que se enviara contraseña.
   * @param  {String} password nueva contraseña que se envia al correo.
   * @return
   */
  sendMailPassword: function(email, password) {
    sails.hooks.email.send("password", {
        password: password
      }, {
        to: email,
        subject: "Recuperación contraseña LA FOURNEE"
      },
      function(err) {});
  },


}
