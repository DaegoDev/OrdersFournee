/**
 * api/response/conflict.js
 *
 * Esta respuesta considera una solicitud que no pudo ser completada, pero el usuario
 * podrá completarla repitiendo la solicitud con algun parametro nuevo.
 *
 */

module.exports = function (data, options) {
  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  sails.log.silly('res.conflict() :: Sending 409 ("CONFLICT") response');

  // set status code
  res.status(409);

  // Log error to console
  if (data !== undefined) {
    sails.log.verbose('Sending 409 ("Conflict") response: \n',data);
  }
  else sails.log.verbose('Sending 409 ("Conflict") response');

  // Only include errors in response if application environment
  // is not set to 'production'.  In production, we shouldn't
  // send back any identifying information about errors.
  if (sails.config.environment === 'production' && sails.config.keepResponseErrors !== true) {
    data = undefined;
  }

    // If appropriate, serve data as JSON(P)
    // If views are disabled, revert to json
    if (req.wantsJSON || sails.config.hooks.views === false) {
      return res.jsonx(data);
    }

    // If second argument is a string, we take that to mean it refers to a view.
    // If it was omitted, use an empty object (`{}`)
    options = (typeof options === 'string') ? { view: options } : options || {};

    // Attempt to prettify data for views, if it's a non-error object
    var viewData = data;
    if (!(viewData instanceof Error) && 'object' == typeof viewData) {
      try {
        viewData = require('util').inspect(data, {depth: null});
      }
      catch(e) {
        viewData = undefined;
      }
    }

    // If a view was provided in options, serve it.
    // Otherwise try to guess an appropriate view, or if that doesn't
    // work, just send JSON.
    if (options.view) {
      return res.view(options.view, { data: viewData, title: 'CONFLICT' });
    }

    // If no second argument provided, try to serve the implied view,
    // but fall back to sending JSON(P) if no view can be inferred.
    else return res.guessView({ data: viewData, title: 'CONFLICT' }, function couldNotGuessView () {
      return res.jsonx(data);
    });

}
