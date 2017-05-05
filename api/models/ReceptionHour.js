/**
 * ReceptionHour.js
 *
 *@description :: Modelo que representa la tabla reception_hour en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'reception_hour',
  attributes: {
    initialReceptionTime: {
      type: 'string',
      size: 8,
      notNull: true,
      columnName: 'initial_reception_time'
    },
    finalReceptionTime: {
      type: 'string',
      size: 8,
      notNull: true,
      columnName: 'final_reception_time'
    },
    // Añade una referencia a weekDay
    weekDay: {
      model: 'weekDay',
      notNull: true,
      columnName: 'week_day_id'
    },
    // Añade una referencia a client
    client: {
      model: 'client',
      notNull: true,
      columnName: 'client_id'
    }
  }
};
