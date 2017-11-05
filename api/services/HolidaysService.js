/**
 * HolidaysService.js
 *
 * @description :: Server-side logic to manage the holidays.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/**
 *  Librerias utilizadas para la hacer las peticiones que obtienen los días festivos.
 */
var Client = require('node-rest-client').Client;
const syncClient = require('sync-rest-client');

module.exports = {

  getHolidays: function(year, isoCode, callback) {
    var response = syncClient.get("http://kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForYear&year=" + year + "&country=" + isoCode + "&region=");
    return response.body;
  },

  isHoliday: function (date, isoCode) {
    var dateToRequest = date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear();
    var response = syncClient.get("http://kayaposoft.com/enrico/json/v1.0/?action=isPublicHoliday&date=" + dateToRequest + "&country=" + isoCode);
    return response.body.isPublicHoliday;
  }
}
