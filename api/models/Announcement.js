/**
 * Announcement.js
 *
 * @description :: Modelo que representa la tabla announcement en la base de datos
 * @autors      :: Jonnatan Rios Vasquez- jrios328@gmail.com    Diego Alvarez-daegoudea@gmail.com
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'announcement',
  attributes: {
    createdAt: {
      type: 'date',
      unique: true,
      columnName: 'created_at'
    },
    updatedAt: {
      type: 'date',
      unique: true,
      columnName: 'updated_at'
    },
    content: {
      type: 'text',
      required: true,
      notNull: true,
      columnName: 'content'
    },
    // Añade una referencia a user
    user: {
      model: 'user'
    }
  }
};
