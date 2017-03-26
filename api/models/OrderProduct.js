/**
 * OrderProduct.js
 *
 * @description :: Modelo que representa la tabla order_product en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // migrate: 'drop',
  tableName: 'order_product',
  attributes: {
    // Añade una referencia a client_product
    product: {
      model: 'clientproduct',
      notNull: true,
      columnName: 'client_product'
    },
    // Añade una referencia a order
    orderId: {
      model: 'order',
      notNull: true,
      columnName: 'order_id'
    },
    amount: {
      type: 'integer',
      notNull: true,
      required: true,
      columnName: 'amount'
    },
    baked: {
      type: 'boolean',
      notNull: true,
      required: true,
      columnName: 'baked'
    }
  }
};
