/**
 * Item.js
 *
 * @description ::  Modelo que representa la tabla item en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // migrate: 'safe',
  tableName: 'item',
  attributes: {
    value: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      columnName: 'value'
    },
    shortValue: {
      type:'string',
      size: 8,
      notNull: true,
      required: true,
      columnName: 'short_value'
    },
    enabled: {
      type: 'boolean',
      notNull: true,
      defaultsTo: true,
      required: true,
      columnName: 'enabled'
    },
    // Añade una referencia a product
    products: {
      collection: 'product',
      via: 'item',
      through: 'itemproduct'
    },
    // Añade una referencia a elemento
    element: {
      model: 'element',
      notNull: true,
      columnName: 'element'
    },
    // Añade una referencia a itemConfig
    itemConfig: {
      collection:'itemConfig',
      via: 'item'
    },
    // Añade una referencia a ingredient
    ingredient: {
      collection: 'ingredient',
      via: 'item',
      through: 'recipe'
    }
  }
};
