/**
 * Item.js
 *
 * @description ::  Modelo que representa la tabla item en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'item',
  attributes: {
    name: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      columnName: 'name',
    },
    value: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      unique: true,
      columnName: 'value'
    },
    shortValue: {
      type:'string',
      size: 8,
      notNull: true,
      required: true,
      unique : true,
      columnName: 'short_value'
    },
    // Añade una referencia a product
    products: {
      collection: 'product',
      via: 'item',
      through: 'itemproduct'
    }
  }
};
