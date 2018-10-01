/**
 * Element.js
 *
 * @description :: Modelo que representa la tabla product en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // migrate: 'safe',
  tableName: 'element',
  attributes: {
    name: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      unique: true,
      columnName: 'name'
    },
    items: {
      collection: 'item',
      via: 'element'
    },
    enabled: {
      type: 'boolean',
      notNull: true,
      defaultsTo: true,
      required: true,
      columnName: 'enabled'
    }
  }
};
