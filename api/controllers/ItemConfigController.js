/**
 * ItemConfigController
 *
 * @description :: Server-side logic for managing itemconfigs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
   * Funcion para crear una configuración para el complemento de forma (item)
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */

  createItemConfig: function(req, res) {
    //variables declaration
    var itemId = null;
    var moldAmount = null;
    var amountByTin = null;

    // variables definition from the params of the request.
    itemId = req.param('itemId');

    if (!itemId) {
      return res.badRequest('Se debe ingresar el id del item.');
    }

    moldAmount = req.param('moldAmount');

    if (!moldAmount) {
      return res.badRequest('Se debe ingresar la cantidad de moldes.');
    }

    amountByTin = req.param('amountByTin');

    if (!amountByTin) {
      return res.badRequest('Se debe ingresar la cantidad de moldes por lata.');
    }

    // Organización de credenciales de un item config.
    var itemConfigParams = {
        item: itemId,
        moldAmount: moldAmount,
        amountByTin: amountByTin
    };

    //An  item config is created in the database
    ItemConfig.create(itemConfigParams)
      .then((itemConfig) => {
        res.created(itemConfig);
      })
      .catch((err) => {
        sails.log.debug(err);
        res.serverError();
      })

  },

  /**
   * Funcion para actualizar una configuración para el complemento de forma (item)
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */

  updateItemConfig: function(req, res) {
    //variables declaration
    var itemConfigId = null;
    var moldAmount = null;
    var amountByTin = null;

    // variables definition from the params of the request.
    itemConfigId = req.param('itemConfigId');
    sails.log.debug(itemConfigId);
    if (!itemConfigId) {
      return res.badRequest('Se debe ingresar el id del item config.');
    }

    moldAmount = req.param('moldAmount');

    if (!moldAmount) {
      return res.badRequest('Se debe ingresar la cantidad de moldes.');
    }

    amountByTin = req.param('amountByTin');

    if (!amountByTin) {
      return res.badRequest('Se debe ingresar la cantidad de moldes por lata.');
    }

    // Organización de credenciales de un item config.
    var itemConfigParams = {
        moldAmount: moldAmount,
        amountByTin: amountByTin
    };
    
    //An  item config is updated in the database
    ItemConfig.update({id: itemConfigId},itemConfigParams)
      .then((itemConfig) => {
        if (!itemConfig) {
            throw {
                code: 2,
                msg: "La configuración del item no se actulizó correctamente."
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
};

