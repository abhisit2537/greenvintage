'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function (app) {
  // Products Routes
  app.route('/api/products')//.all(productsPolicy.isAllowed)
    .get(products.list)
    .post(products.create);

  app.route('/api/dashboard').all(productsPolicy.isAllowed)
    .get(
    products.getproducts,
    products.getshopseller,
    products.prodpoppular,
    products.shoppoppular,
    products.prodlastview,
    products.cookingdashboard
    );

  app.route('/api/productspoppular').all(productsPolicy.isAllowed)
    .get(products.getproducts, products.productspoppular);

  app.route('/api/productslastview').all(productsPolicy.isAllowed)
    .get(products.getproducts, products.productslastview);

  app.route('/api/products/:productId').all(productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  app.route('/api/productbyshopid/:shopId').all(productsPolicy.isAllowed)
    .get(products.productbyshopid);
  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
  app.param('shopId', products.shopByID);
};
