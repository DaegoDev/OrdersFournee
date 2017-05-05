/**
 * User.js
 *
 * @description :: Modelo que representa la tabla user en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  migrate: 'safe',
  tableName: 'user',
  attributes: {
    username: {
      type: 'string',
      size: 64,
      unique: true,
      notNull: true,
      required: true,
      columnName: 'username'
    },
    password: {
      type: 'string',
      size: 256,
      minLength: 6,
      notNull: true,
      required: true,
      columnName: 'password'
    },
    role: {
      type: 'string',
      size: 32,
      notNull: true,
      required: true,
      columnName: 'role'
    },
    state: {
      type: 'boolean',
      required: true,
      notNull: true,
      defaultsTo: true,
      columnName: 'state'
    },
    // Añade una referencia a employee
    employee: {
      collection:'employee',
      via: 'user'
    },
    client: {
      collection:'client',
      via: 'user'
    },
    // Añade una referencia a Announcement
    announcements : {
      collection: 'announcement',
      via: 'user'
    },
    // Si activo esto no me recupera la contraseña para usarla en la funcion updatePassword
    /*toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }*/
  }
};
