/**
 * ItemConfig.js
 *
 * @description :: Modelo que representa la tabla item_config en la base de datos
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'item_config',
  attributes: {
    // Añade una referencia a item
    item: {
      columnName: 'item',
      notNull: true,
      required: true,
      model: 'item',
      unique: true
    },
    moldAmount: {
      type: 'integer',
      notNull: true,
      required: true,
      columnName: 'mold_amount'
    },
    amountByTin: {
      type: 'integer',
      notNull: true,
      required: true,
      columnName: 'amount_by_tin'
    }
  }
};

