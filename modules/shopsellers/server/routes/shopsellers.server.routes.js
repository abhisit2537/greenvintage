'use strict';

/**
 * Module dependencies
 */
var shopsellersPolicy = require('../policies/shopsellers.server.policy'),
  shopsellers = require('../controllers/shopsellers.server.controller');

module.exports = function (app) {
  // Shopsellers Routes
  app.route('/api/shopsellers').all(shopsellersPolicy.isAllowed)
    .get(shopsellers.list)
    .post(shopsellers.create);

  app.route('/api/shopsellerspoppular').all(shopsellersPolicy.isAllowed)
    .get(shopsellers.getshopsellers, shopsellers.shopsellerspoppular);

  app.route('/api/shopsellers/:shopsellerId').all(shopsellersPolicy.isAllowed)
    .get(shopsellers.read)
    .put(shopsellers.update)
    .delete(shopsellers.delete);

  // Finish by binding the Shopseller middleware
  app.param('shopsellerId', shopsellers.shopsellerByID);
};
