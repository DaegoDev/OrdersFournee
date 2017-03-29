module.exports = function (data, code, message, root) {
  var response = _.assign({
    code: code || 'E.UNAUTHORIZED',
    message: message || 'Missing or invalid authentication token',
    data: data || {}
  }, root);

  this.req._sails.log.silly('Sent (401 UNAUTHORIZED)\n', response);
  this.res.status(401);
  this.res.jsonx(response);
};
