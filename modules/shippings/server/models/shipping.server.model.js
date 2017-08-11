'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Shipping Schema
 */
var ShippingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Shipping name',
    trim: true
  },

  detail: {
    type: String
  },

  day: {
    type: Number,
    required: 'Please fill Shipping day'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Shipping', ShippingSchema);
