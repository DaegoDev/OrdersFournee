/**
 * ProductionReportController
 *
 * @description :: Server-side logic for managing productionreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
   * Function to get the production report from database.
   * @param  {Object} req Request object
   * @param  {Object} res Response object
   * @return {Object}
   */

   getProductionReport: function(req, res){
       // variables declaration
        var initialDate = null;
        var finalDate = null;
        var response = {};

        // Definición de variables apartir de los parametros de la solicitud y validaciones.
        initialDate = req.param('initialDate');
        sails.log.debug(initialDate);
        if (!initialDate) {
            return res.badRequest('Se debe ingresar la fecha inicial.');
        }

        finalDate = req.param('finalDate');
        sails.log.debug(finalDate);
        if (!finalDate) {
            return res.badRequest('Se debe ingresar la fecha final.');
        }

        var dataInitialDate = parseInt(initialDate);
        initialDate = TimeZoneService.getDate({
            timestamp: dataInitialDate
        });
        var dataFinalDate = parseInt(finalDate);
        finalDate = TimeZoneService.getDate({
            timestamp: dataFinalDate
        });

        var dateInterval = [initialDate.toISOString(), finalDate.toISOString()];
        sails.log.debug(dateInterval);
        ProductionConfig.find()
        .sort('id ASC')
        .then(config => {
            var tinsOven = config[0].value;
            var kneadingCapacity = config[1].value;
            response.globalConfig = config;
            Order.query('SELECT id, code, name, short_name, amount, group_concat(itemConfig separator "/") as items, group_concat(recipeIng separator "/") as recipe \
            FROM \
            ( \
              SELECT DISTINCT ord.id, prod.code, prod.name, prod.short_name, op.amount, \
                concat_ws(",", item.element, item.id, item.short_value, item.value, ic.mold_amount, ic.amount_by_tin) as itemConfig, \
                concat_ws(",", ing.name, recipe.amount) as recipeIng \
                FROM `order` as ord \
                LEFT JOIN order_product as op ON op.order_id = ord.id \
                LEFT JOIN client_product as cp ON op.client_product = cp.id \
                LEFT JOIN product as prod ON cp.product = prod.code \
                LEFT JOIN item_product as ip ON ip.product_code = prod.code \
                LEFT JOIN item ON item.id = ip.item_id \
                LEFT JOIN item_config as ic ON ic.item = item.id \
                LEFT JOIN recipe ON item.id = recipe.dough \
                LEFT JOIN ingredient ing ON ing.id = recipe.ingredient \
                WHERE item.element in (11, 13, 15) AND ord.created_at >= ? AND ord.created_at <= ? \
            ) AS report \
            group by id, code, name, short_name, amount ORDER BY code;', dateInterval,
            function(err, ordersProducts) {
                if (err) {
                    return res.serverError(err);
                }
                var report = {};
                ordersProducts.forEach(function(product, index, products) {
                    var items = product.items.split("/");
                    var dough = "";
                    var compForm = "";
                    var weight = "";
    
                    items.forEach(item => {
                        var itemType = item.split(",")[0];
                        if (itemType == 11) {
                            dough = item;
                        } else if (itemType == 13) {
                            compForm = item;
                        } else if (itemType == 15) {
                            weight = item;
                        }
                    });
                    var doughData = dough.split(",");
                    var compFormData = compForm.split(",");
                    var weightData = weight.split(",");
    
                    var doughId = doughData[1];
                    var doughName = doughData[3];
                    if(!report[doughId]){
                        report[doughId] = {};
                    }
    
                    if(!report[doughId].products){
                        report[doughId].products = [];
                    }

                    if(!report[doughId].recipe){
                        report[doughId].recipe = product.recipe;
                    }

                    var product = {
                        code: product.code,
                        name: product.name,
                        shortName: product.short_name,
                        amount: product.amount,
                        compFormMoldAmount: compFormData[4],
                        compFormAmountByTin: compFormData[5],
                        weightValue: weightData[2],
                        batchesMoldAmount: Math.ceil(product.amount / compFormData[4]), //Tandas según cantidad de moldes
                        tinAmount: Math.ceil(product.amount / compFormData[5]) // Cantidad de latas a usar
                    }

                    var tmpProductAdded = productAdded(product.code, report[doughId].products, product.amount);

                    if (tmpProductAdded == null) {
                        report[doughId].products.push(product);
                        tmpProductAdded = product;
                    }
                    sails.log.debug("Producto añadido: ", tmpProductAdded);
                    
                    if(!report[doughId].totalAmount){
                        report[doughId].totalAmount = 0;
                    }

                    if(!report[doughId].totalWeight){
                        report[doughId].totalWeight = 0;
                    }
    
                    if(!report[doughId].maxBatches){
                        report[doughId].maxBatches = 0;
                    }
                    
                    report[doughId].doughId = doughId;
                    report[doughId].doughName = doughName;
                    report[doughId].totalAmount += product.amount;
                    report[doughId].totalWeight += (product.amount * (parseFloat(weightData[2])) / 1000);
                    // sails.log.debug("Cantidad total: ", parseFloat(report[doughId].totalAmount));
                    // sails.log.debug("Peso: ", parseFloat(weightData[2]));
                    // sails.log.debug("Capacidad amasadora: ", parseFloat(kneadingCapacity));
                    var kneadingBatches = Math.ceil((parseFloat(report[doughId].totalAmount) * parseFloat(report[doughId].totalWeight)) / (parseFloat(kneadingCapacity) * 1000));
                    var ovenBatches = Math.ceil(parseFloat(tmpProductAdded.tinAmount) / parseFloat(tinsOven));
                    sails.log.debug("Tandas según amasadora: ", kneadingBatches);
                    sails.log.debug("Tandas según horno: ", ovenBatches);
                    
                    // report[doughId].maxBatches = Math.max(report[doughId].maxBatches, kneadingBatches, ovenBatches, tmpProductAdded.batchesMoldAmount);
                    // Valida si el max es de la configuración general o por producto.
                    // var maxGeneralBatches = Math.max(kneadingBatches, ovenBatches);
                    // if (kneadingBatches >= report[doughId].maxBatches) {
                    //     report[doughId].codeMaxBatches = 1;
                    //     report[doughId].maxBatches = kneadingBatches;
                    //     sails.log.debug("totalWeigth: ", report[doughId].totalWeight);
                    //     sails.log.debug("totalWeigth: ", report[doughId].totalWeight);
                        report[doughId].maxByProductKneading = (kneadingCapacity / report[doughId].products.length).toFixed(2);
                    // }

                    // if (ovenBatches > report[doughId].maxBatches) {
                    //     report[doughId].codeMaxBatches = 2;
                    //     report[doughId].maxBatches = ovenBatches;
                    // }

                    // if (tmpProductAdded.batchesMoldAmount >= report[doughId].maxBatches) {
                    //     report[doughId].codeMaxBatches = 3;
                    //     report[doughId].maxBatches = tmpProductAdded.batchesMoldAmount;
                    // }
                });
    
                response.doughs = report;
                res.ok(response);
            })
        })
        .catch(error => {
            sails.log.error("Error obteniendo la configuración de producción: ", error);
            res.serverError();
        })
   }
};

function productAdded(productCode, products, productAmount) {
    var productLength = products.length;
    var isAdded = null;

    for (let index = 0; index < productLength; index++) {
        const code = products[index].code;  
        if(code == productCode){
            products[index].amount += productAmount;
            products[index].batchesMoldAmount = Math.ceil(products[index].amount / products[index].compFormMoldAmount);
            products[index].tinAmount = Math.ceil(products[index].amount / products[index].compFormAmountByTin);
            isAdded = products[index];
            break;
        }
    }
    return isAdded;
}
