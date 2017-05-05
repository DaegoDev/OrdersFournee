/**
 * ReceptionHourController
 *
 * @description :: Server-side logic for managing receptionhours
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
   * Funcion para obtener los días de la semana.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getWeekDays: function (req, res) {
    WeekDay.find()
    .sort('id ASC')
    .then(function (weekDays) {
      res.ok(weekDays);
    })
    .catch(function (err) {
      sails.serverError(err);
      res.serverError();
    })
  }
};
