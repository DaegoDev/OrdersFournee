/**
 * Order.js
 *
 * @description :: Modelo que representa la tabla order en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // migrate: 'drop',
  tableName: 'order',
  attributes: {
    createdAt: {
      type: 'datetime',
      unique: true,
      notNull: true,
      required: true,
      columnName: 'created_at'
    },
    deliveryDate: {
      type: 'datetime',
      notNull: true,
      required: true,
      columnName: 'delivery_date'
    },
    state: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      defaultsTo: 'confirmado',
      columnName: 'state'
    },
    initialSuggestedTime: {
      type: 'string',
      size: 8,
      columnName: 'initial_suggested_time'
    },
    finalSuggestedTime: {
      type: 'string',
      size: 8,
      columnName: 'final_suggested_time'
    },
    additionalInformation: {
      type: 'text',
      columnName: 'additional_information'
    },
    observation: {
      type: 'text',
      columnName: 'observation'
    },
    // Añade una referencia a client
    client: {
      model: 'client',
      columnName: 'client'
    },
    // Añade una referencia a client_employee
    clientEmployee: {
      model: 'clientemployee',
      columnName: 'client_employee'
    },
    // Añade una referencia a client_product
    products: {
      collection: 'clientproduct',
      via: 'order',
      through: 'orderproduct'
    }
  }
};
