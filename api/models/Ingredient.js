/**
 * Ingredient.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'ingredient',
  attributes: {
    name: {
      type: 'string',
      size: 64,
      notNull: true,
      required: true,
      unique: true,
      columnName: 'name'
    },
    enabled: {
      type: 'boolean',
      notNull: true,
      defaultsTo: true,
      required: true,
      columnName: 'enabled'
    },
    // Añade una referencia a dough
    dough: {
      collection: 'item',
      via: 'ingredient',
      through: 'recipe'
    }
  }
};

