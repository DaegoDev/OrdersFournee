/**
 * Announcement.js
 *
 * @description :: Modelo que representa la tabla announcement en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // migrate: 'drop',
  tableName: 'announcement',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      columnName: 'id'
    },
    createdAt: {
      type: 'datetime',
      columnName: 'created_at'
    },
    updatedAt: {
      type: 'datetime',
      columnName: 'updated_at'
    },
    title: {
      type: 'string',
      size: 128,
      notNull: true,
      columnName: 'title'
    },
    content: {
      type: 'text',
      required: true,
      notNull: true,
      columnName: 'content'
    },
    // Añade una referencia a user
    user: {
      model: 'user',
      columnName: 'user'
    }
  }
};
