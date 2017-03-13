/**
 * Item.js
 *
 * @description ::  Modelo que representa la tabla item en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'item',
  attributes: {
    name: {
      type: 'string',
      size: 64,
      required: true,
      columnName: 'name',
    },
    value: {
      type: 'string',
      size: 64,
      required: true,
      unique: true,
      columnName: 'value'
    },
    shortValue: {
      type:'string',
      size: 8,
      required: true,
      unique : true,
      columnName: 'short_value'
    }
  }
};
