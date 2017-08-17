'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  Shopseller = mongoose.model('Shopseller'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Product
 */
exports.create = function (req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Update a Product
 */
exports.update = function (req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.delete = function (req, res) {
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function (req, res) {
  Product.find().sort('-created').populate('user', 'displayName').populate('shippings.shipping').populate('payment.payment').populate('shopseller')
    .exec(function (err, products) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(products);
      }
    });
};

/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('user', 'displayName').populate('shippings.shipping').populate('payment.payment').populate('shopseller')
    .exec(function (err, product) {
      if (err) {
        return next(err);
      } else if (!product) {
        return res.status(404).send({
          message: 'No Product with that identifier has been found'
        });
      }
      req.product = product;
      next();
    });
};

exports.shopByID = function (req, res, next, shopId) {

  Product.find({ shopseller: { _id: shopId } }).populate('user', 'displayName').populate('shopseller')
    .exec(function (err, product) {
      if (err) {
        return next(err);
      } else if (!product) {
        return res.status(404).send({
          message: 'No Product with that identifier has been found'
        });
      }
      req.shopId = product;
      next();
    });
};


exports.productbyshopid = function (req, res) {
  res.jsonp(req.shopId);
};

exports.productspoppular = function (req, res) {
  var productPop = req.products;
  productPop.sort(function (a, b) {
    return (a.historyLog.length < b.historyLog.length) ? 1 : ((b.historyLog.length < a.historyLog.length) ? -1 : 0);
  });
  res.jsonp(productPop);
};

exports.productslastview = function (req, res) {
  var productLastview = req.products;
  var product = new Product(req.body);
  product.user = req.user;
  productLastview.forEach(function (itm) {
    if (itm.historyLog.length > 9) {
      itm.historyLog.shift();
      itm.historyLog.push({
        customerid: product.user,
        hisdate: new Date().now,
        idprod: productLastview._id
      });
    } else {
      itm.historyLog.push({
        customerid: product.user,
        hisdate: new Date().now,
        idprod: productLastview._id
      });
    }
  });
  res.jsonp(productLastview);
};

exports.getproducts = function (req, res, next) {
  Product.find().sort('-created').populate('user', 'displayName').populate('shippings.shipping').populate('payment.payment').populate('shopseller')
    .exec(function (err, products) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.products = products;
        next();
      }
    });
};

exports.getshopseller = function (req, res, next) {
  Shopseller.find().sort('-created').exec(function (err, shopsellers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.shopsellers = shopsellers;
      next();
    }
  });
};

exports.prodpoppular = function (req, res, next) {
  var prodPop = req.products;
  prodPop.sort(function (a, b) {
    return (a.historyLog.length < b.historyLog.length) ? 1 : ((b.historyLog.length < a.historyLog.length) ? -1 : 0);
  });
  req.prodPop = prodPop;
  next();
};

exports.shoppoppular = function (req, res, next) {
  var shopPop = req.shopsellers;
  shopPop.sort(function (a, b) {
    return (a.historylog.length < b.historylog.length) ? 1 : ((b.historylog.length < a.historylog.length) ? -1 : 0);
  });
  req.shopPop = shopPop;
  next();
};

exports.prodlastview = function (req, res, next) {
  var prodLastview = req.products;
  var product = new Product(req.body);
  product.user = req.user;
  prodLastview.forEach(function (itm) {
    if (itm.historyLog.length > 9) {
      itm.historyLog.shift();
      itm.historyLog.push({
        customerid: product.user,
        hisdate: new Date().now,
        idprod: prodLastview._id
      });
    } else {
      itm.historyLog.push({
        customerid: product.user,
        hisdate: new Date().now,
        idprod: prodLastview._id
      });
    }
  });
  req.prodLastview = prodLastview;
  next();
};

exports.cookingdashboard = function (req, res) {
  res.jsonp({
    products: req.products,
    shopsellers: req.shopsellers,
    productspoppular: req.prodPop,
    shopsellerspoppular: req.shopPop,
    productslastview: req.prodLastview,

  });
};