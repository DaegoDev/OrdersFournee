/**
* AlternativeConnectionService.js
*
* @description :: Server-side logic for managing a new connection for the transactions.
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

/**
*  Librerias utilizadas para la nueva coneccion.
*/
var mySqlPath = sails.config.appPath + '/node_modules/sails-mysql/node_modules/mysql';
var mysql = require(mySqlPath);
var createMySQLWrap = require('mysql-wrap');

module.exports = {

  /**
  * Función para obtener una nueva coneccion a la base de datos.
  * @return {String}       Retorna la nueva coneccion.
  */
  getConnection: function () {
    var sailsMySqlConfig = sails.config.connections.localMysql;
    var connection = mysql.createConnection({
      host: sailsMySqlConfig.host,
      user: sailsMySqlConfig.user,
      password: sailsMySqlConfig.password,
      database: sailsMySqlConfig.database
    });

    // Paso la coneccion al constructor de la libreria mysql-wrap
    var sql = createMySQLWrap(connection);
    return {
      sql: sql,
      connection: connection
    };
  },

};
