/**
 * WeekDay.js
 *
 *@description :: Modelo que representa la tabla week_day en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // migrate: 'safe',
  tableName: 'week_day',
  attributes: {
    name: {
      type: 'string',
      size: 32,
      notNull: true,
      required: true,
      unique: true,
      columnName: 'name'
    },
    // Añade una referencia a client
    clients: {
      collection: 'client',
      via: 'weekDay',
      through: 'receptionhour'
    },
  }
};
