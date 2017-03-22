/**
 * Employee.js
 *
 * @description :: Modelo que representa la tabla employee en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'employee',
  attributes: {
    name: {
      type: 'string',
      size: 256,
      notNull: true,
      required: true,
      columnName: 'name'
    },
    // Añade una referencia a user
    user: {
      columnName: 'user',
      notNull: true,
      required: true,
      model: 'user',
      unique: true
    },
    toJSON: function() {
      var obj = this.toObject();
      return obj;
    }
  }
};
