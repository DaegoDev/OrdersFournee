/**
 * ClientProduct.js
 *
 * @description :: Modelo que representa la tabla client_product en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'client_product',
  attributes: {
    // Añade una referencia a client
    client: {
      model: 'client'
    },
    // Añade una referencia a product
    product: {
      model: 'product'
    },
    customName: {
      type: 'string',
      size: 64,
      columnName: 'custom_name'
    },
    customPrice: {
      type: 'float',
      columnName: 'custom_price'
    },
    enabled: {
      type: 'boolean',
      notNull: true,
      defaultsTo: true,
      required: true,
      columnName: 'enabled'
    },
    // Añade una referencia a order
    orders: {
      collection: 'order',
      via: 'product',
      through: 'orderproduct'
    }
  }
};
