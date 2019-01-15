/**
 * ProductionConfig.js
 *
 * @description :: Modelo que representa la tabla production_config en la base de datos
 * @author      :: Jonnatan Rios - jrios328@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'production_config',
  attributes: {
    label: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      columnName: 'label'
    },
    value: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      columnName: 'value'
    },
  }
};

