/**
 * Address.js
 *
 * @description :: Modelo que representa la tabla address en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // migrate: 'drop',
  tableName: 'address',
  attributes: {
    country: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      columnName: 'country'
    },
    department: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      columnName: 'department'
    },
    city: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      columnName: 'city'
    },
    neighborhood: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      columnName: 'neighborhood'
    },
    nomenclature: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      columnName: 'nomenclature'
    },
    additionalInformation: {
      type: 'text',
      columnName: 'additional_information'
    },
    // Añade una referencia a client
    clientBill: {
      collection: 'client',
      via: 'billAddress'
    },
    // Añade una referencia a client
    clientDelivery: {
      collection: 'client',
      via: 'deliveryAddress'
    }
  }
};
