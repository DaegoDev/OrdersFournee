/**
 * ClientEmployee.js
 *
 * @description :: Modelo que representa la tabla user en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'client_employee',
  attributes: {
    name: {
      type: 'string',
      size: 256,
      notNull: true,
      required: true,
      columnName: 'name'
    },
    phonenumber: {
      type: 'string',
      size: 32,
      notNull: true,
      required: true,
      columnName: 'phonenumber'
    },
    state: {
      type: 'boolean',
      defaultsTo: true,
      notNull: true,
      required: true,
      columnName: 'state'
    },
    role: {
      type: 'string',
      size: 32,
      notNull: true,
      required: true,
      columnName: 'role'
    },
    client: {
      model: 'client',
      columnName: 'client'
    },
    orders: {
      collection: 'order',
      via: 'clientEmployee'
    }
  }
};
