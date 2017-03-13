/**
 * User.js
 *
 * @description :: Modelo que representa la tabla user en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'user',
  attributes: {
    username: {
      type: 'string',
      size: 64,
      unique: true,
      required: true,
      columnName: 'username'
    },
    password: {
      type: 'string',
      size: 256,
      minLength: 6,
      required: true,
      columnName: 'password'
    },
    role: {
      type: 'string',
      size: 32,
      required: true,
      columnName: 'role'
    },
    state: {
      type: 'boolean',
      required: true,
      defaultsTo: true,
      columnName: 'state'
    },
    // Añade una referencia a employee
    employee: {
      collection:'employee',
      via: 'userId'
    },
    // Añade una referencia a Announcement
    announcements : {
      collection: 'announcement',
      via: 'user'
    }
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  }
};
