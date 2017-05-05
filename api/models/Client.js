/**
 * Client.js
 *
 * @description :: Modelo que representa la tabla client en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'client',
  attributes: {
    legalName: {
      type: 'string',
      size: 256,
      unique: true,
      notNull: true,
      required: true,
      columnName: 'legal_name'
    },
    nit: {
      type: 'string',
      size: 32,
      notNull: true,
      required: true,
      unique: true,
      columnName: 'nit'
    },
    tradeName: {
      type: 'string',
      size: 256,
      notNull: true,
      required: true,
      columnName: 'trade_name'
    },
    ownerName: {
      type: 'string',
      size: 256,
      columnName: 'owner_name'
    },
    ownerPhonenumber: {
      type: 'string',
      size: 32,
      columnName: 'owner_phonenumber'
    },
    businessPhonenumber: {
      type: 'string',
      size: 32,
      columnName: 'business_phonenumber'
    },
    additionalInformation: {
      type: 'text',
      columnName: 'additional_information'
    },
    // Añade una referencia a address
    billAddress: {
      columnName: 'bill_address',
      model: 'address',
      unique: true
    },
    // Añade una referencia a address
    deliveryAddress: {
      columnName: 'delivery_address',
      model: 'address',
      unique: true
    },
    // Añade una referencia a user
    user: {
      columnName: 'user',
      model: 'user',
      notNull: true,
      required: true,
      unique: true
    },
    // Añade una referencia a product

    products: {
      collection: 'product',
      via: 'client',
      through: 'clientproduct'
    },
    // Añade una referencia a order
    orders: {
      collection: 'order',
      via: 'client'
    },
    // Añade una referencia a client_employee
    clientEmployee: {
      collection: 'clientemployee',
      via: 'client'
    },
    //Añade una referencia a week_day
    receptionHours :{
      collection: 'weekday',
      via: 'client',
      through: 'receptionhour'
    }
  }
};
