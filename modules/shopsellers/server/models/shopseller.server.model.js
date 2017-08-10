'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Shopseller Schema
 */
var ShopsellerSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Shopseller name',
    trim: true
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

mongoose.model('Shopseller', ShopsellerSchema);
