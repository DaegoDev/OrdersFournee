/**
 * Recipe.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'recipe',
  attributes: {
    amount: {
      type: 'integer',
      notNull: true,
      required: true,
      columnName: 'amount'
    },
    // Añade una referencia a ingredient
    ingredient: {
      model: 'ingredient',
      notNull: true,
      columnName: 'ingredient'
    },
    // Añade una referencia a dough
    dough: {
      model: 'item',
      notNull: true,
      columnName: 'dough'
    }
  }
};

