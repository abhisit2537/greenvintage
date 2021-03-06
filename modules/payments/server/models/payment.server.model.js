'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Payment Schema
 */
var PaymentSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Payment name',
    trim: true
  },

 detail: {
    type: String,
 },

 img: {
    url:String,
    id:String
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

mongoose.model('Payment', PaymentSchema);
