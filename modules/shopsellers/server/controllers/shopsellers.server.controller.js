'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Shopseller = mongoose.model('Shopseller'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Shopseller
 */
exports.create = function(req, res) {
  var shopseller = new Shopseller(req.body);
  shopseller.user = req.user;

  shopseller.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopseller);
    }
  });
};

/**
 * Show the current Shopseller
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var shopseller = req.shopseller ? req.shopseller.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  shopseller.isCurrentUserOwner = req.user && shopseller.user && shopseller.user._id.toString() === req.user._id.toString();

  res.jsonp(shopseller);
};

/**
 * Update a Shopseller
 */
exports.update = function(req, res) {
  var shopseller = req.shopseller;

  shopseller = _.extend(shopseller, req.body);

  shopseller.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopseller);
    }
  });
};

/**
 * Delete an Shopseller
 */
exports.delete = function(req, res) {
  var shopseller = req.shopseller;

  shopseller.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopseller);
    }
  });
};

/**
 * List of Shopsellers
 */
exports.list = function(req, res) {
  Shopseller.find().sort('-created').populate('user', 'displayName').exec(function(err, shopsellers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(shopsellers);
    }
  });
};

/**
 * Shopseller middleware
 */
exports.shopsellerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Shopseller is invalid'
    });
  }

  Shopseller.findById(id).populate('user', 'displayName').exec(function (err, shopseller) {
    if (err) {
      return next(err);
    } else if (!shopseller) {
      return res.status(404).send({
        message: 'No Shopseller with that identifier has been found'
      });
    }
    req.shopseller = shopseller;
    next();
  });
};
