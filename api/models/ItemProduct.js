/**
 * ItemProduct.js
 *
 * @description :: Modelo que representa la tabla item_product en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  migrate: 'safe',
  tableName: 'item_product',
  attributes: {
    // Añade una referencia a product
    product:{
      model:'product',
      notNull: true
    },
    // Añade una referencia a items
    item: {
      model: 'item',
      notNull: true
    }
  }
};
