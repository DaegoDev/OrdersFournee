/**
 * ProductionConfigController
 *
 * @description :: Server-side logic for managing productionconfigs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
   * Funcion para crear 
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */

  updateProductionConfig: function(req, res) {
    //variables declaration
    var productionConfigId = null;
    var value = null;

    // variables definition from the params of the request.
    productionConfigId = req.param('productionConfigId');

    if (!productionConfigId) {
      return res.badRequest('Se debe ingresar el id de la configuración.');
    }

    value = req.param('value');

    if (!value) {
      return res.badRequest('Se debe ingresar el valor a modificar.');
    }

    // Organización de credenciales de un item config.
    var productionConfigParams = {
        value: value
    };
    
    //An  item config is created in the database
    ItemConfig.update({id: productionConfigId},productionConfigParams)
      .then((productionConfig) => {
        if (!productionConfig) {
            throw {
                code: 2,
                msg: "La configuración de receta/produccion no se actulizó correctamente."
            };
        }
        res.type('json');
        return res.ok();
      })
      .catch((err) => {
        if (err.code) {
            return res.badRequest(err);
        }
        return res.serverError(err);
      })

  },

  /**
   * Funcion para obtener la configuración de producción. 
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */
  getProductionConfig: function(req, res) {
    ProductionConfig.find().sort('id ASC')
      .then(function(data) {
        return res.ok(data);
      })
      .catch(function(err) {
        sails.log.debug(err);
        return res.serverError();
      });
  }
};

