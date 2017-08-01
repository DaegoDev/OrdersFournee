/**
 * Product.js
 *
 * @description :: Modelo que representa la tabla product en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'product',
  attributes: {
    code: {
      type: 'string',
      size: 8,
      primaryKey: true,
      required: true,
      unique: true,
      columnName: 'code'
    },
    name: {
      type: 'string',
      size: 128,
      notNull: true,
      required: true,
      unique: true,
      columnName: 'name'
    },
    shortName: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      unique: true,
      columnName: 'short_name'
    },
    enabled: {
      type: 'boolean',
      notNull: true,
      default: true,
      required: true,
      columnName: 'enabled'
    },
    // Añade una referencia a item
    items: {
      collection: 'item',
      via: 'product',
      through: 'itemproduct'
    },
    // Añade una referencia a client
    clients: {
      collection: 'client',
      via: 'product',
      through: 'clientproduct'
    }
  }
};
