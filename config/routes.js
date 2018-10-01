/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {view: 'homepage'},

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  'POST /client/signup' : {controller: "ClientController", action:"signup"},
  'DELETE /client/delete' : {controller: "ClientController", action:"delete"},
  'PUT /client/updatePassword' : {controller: "ClientController", action:"updatePassword"},
  'PUT /client/enableProduct' : {controller: "ClientController", action:"enableProduct"},
  'PUT /client/disableProduct' : {controller: "ClientController", action:"disableProduct"},
  'GET /client/getProfile' : {controller: "ClientController", action:"getProfile"},
  'GET /client/getProductsEnabled' : {controller: "ClientController", action:"getProductsEnabled"},
  'GET /client/validateInformation' : {controller: "ClientController", action:"validateInformation"},
  'GET /client/getAll' : {controller: "ClientController", action:"getAll"},
  'PUT /client/updateGeneralInfo' : {controller: "ClientController", action:"updateGeneralInfo"},
  'PUT /client/updateBillAddress' : {controller: "ClientController", action:"updateBillAddress"},
  'PUT /client/updateDeliveryAddress' : {controller: "ClientController", action:"updateDeliveryAddress"},
  'PUT /client/updateGeneralInfoAdmin' : {controller: "ClientController", action:"updateGeneralInfoAdmin"},
  'PUT /client/updateDeliveryAddressAdmin' : {controller: "ClientController", action:"updateDeliveryAddressAdmin"},
  'GET /client/getReceptionHour' : {controller: "ClientController", action:"getReceptionHour"},
  'POST /client/createReceptionHour' : {controller: "ClientController", action:"createReceptionHour"},
  'DELETE /client/deleteReceptionHour' : {controller: "ClientController", action:"deleteReceptionHour"},
  'POST /client/createClientEmployee' : {controller: "ClientController", action:"createClientEmployee"},
  'GET /client/validateClient' : {controller: "ClientController", action:"validateClient"},
  'PUT /client/changeProductName' : {controller: "ClientController", action:"changeProductName"},
  'PUT /client/changeProductPrice' : {controller: "ClientController", action:"changeProductPrice"},
  'PUT /client/setMinOrderPrice' : {controller: "ClientController", action:"setMinOrderPrice"},
  'PUT /client/resetPassword' : {controller: "ClientController", action: "resetPassword"},
  'POST /clientEmployee/addClientEmployee' : {controller: "ClientEmployee", action:"addClientEmployee"},
  'GET /clientEmployee/getEmployeesByClient' : {controller: "ClientEmployee", action:"getEmployeesByClient"},
  'POST /employee/signup' : {controller: "EmployeeController", action:"signup"},
  'DELETE /employee/delete' : {controller: "EmployeeController", action:"delete"},
  'PUT /employee/updatePassword' : {controller: "EmployeeController", action:"updatePassword"},
  'GET /employee/getProfile' : {controller: "EmployeeController", action:"getProfile"},
  'GET /employee/getAll' : {controller: "EmployeeController", action:"getAll"},
  'PUT /employee/updateInformation' : {controller: "EmployeeController", action:"updateInformation"},
  'POST /item/createItem' : {controller: "ItemController", action:"createItem"},
  'GET /item/getByName' : {controller: "ItemController", action:"getByName"},
  'GET /item/getAll' : {controller: "ItemController", action:"getAll"},
  'POST /item/createElement' : {controller: "ItemController", action:"createElement"},
  'DELETE /item/deleteElement' : {controller: "ItemController", action:"deleteElement"},
  'GET /item/getProductPriority' : {controller: "ItemController", action:"getProductPriority"},
  'POST /order/create' : {controller: "OrderController", action:"create"},
  'PUT /order/updateDeliveryDate' : {controller: "OrderController", action:"updateDeliveryDate"},
  'PUT /order/changeState' : {controller: "OrderController", action:"changeState"},
  'PUT /order/cancelOrder' : {controller: "OrderController", action:"cancelOrder"},
  'GET /order/getByDeliveryDate' : {controller: "OrderController", action:"getByDeliveryDate"},
  'GET /order/getState' : {controller: "OrderController", action:"getState"},
  'GET /order/getByClient' : {controller: "OrderController", action:"getByClient"},
  'GET /order/getProductionAfterDate' : {controller: "OrderController", action:"getProductionAfterDate"},
  'GET /order/getProductsSelected' : {controller: "OrderController", action:"getProductsSelected"},
  'PUT /order/update' : {controller: "OrderController", action:"update"},
  'GET /order/validateDateToUpdate' : {controller: "OrderController", action:"validateDateToUpdate"},
  'GET /order/validateStateToCancel' : {controller: "OrderController", action:"validateStateToCancel"},
  'PUT /order/setInvoiced' : {controller: 'OrderController', action: "setInvoiced"},
  'POST /order/validateMinOrderPrice' : {controller: 'OrderController', action:'validateMinOrderPrice'},
  'POST /product/create' : {controller: "ProductController", action:"create"},
  'PUT /product/update' : {controller: "ProductController", action:"update"},
  'GET /product/getProductsByClient' : {controller: "ProductController", action:"getProductsByClient"},
  'GET /product/getAllEnabled' : {controller: "ProductController", action:"getAllEnabled"},
  'GET /product/getAllDisabled' : {controller: "ProductController", action:"getAllDisabled"},
  'GET /product/getClientsProducts' : {controller: "ProductController", action:"getClientsProducts"},
  'GET /product/getMinMaxPrices' : {controller: "ProductController", action:"getMinMaxPrices"},
  'PUT /product/disableProduct' : {controller: "ProductController", action:"disableProduct"},
  'PUT /product/enableProduct' : {controller: "ProductController", action:"enableProduct"},
  'PUT /product/updateAllPrices' : {controller: "ProductController", action:"updateAllPrices"},
  'POST /announcement/create' : {controller: "AnnouncementController", action:"create"},
  'PUT /announcement/update' : {controller: "AnnouncementController", action:"update"},
  'DELETE /announcement/delete' : {controller: "AnnouncementController", action:"delete"},
  'GET /announcement/getAll' : {controller: "AnnouncementController", action:"getAll"},
  'GET /receptionHour/getWeekDays' : {controller: "ReceptionHourController", action:"getWeekDays"},
  'POST /auth/signinUser' : {controller: "AuthController", action:"signinUser"},
  'GET /auth/requestTokenRecovery' : {controller: "AuthController", action:"requestTokenRecovery"},
  'PUT /auth/recoverPassword' : {controller: "AuthController", action:"recoverPassword"},
};
