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
  email: String,
  tel: {
    type: String,
    required: 'Please fill Shopseller tel',
  },

  img: {
    url: String,
    id: String
  },
  coverimg: {
    url: String,
    id: String
  },
  detail: String,

  review: [{
    comment: String,
    rate: Number,
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  }],
  rate: {
    type: Number,
  },
  historylog: {
    type: [{
      customerid: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      hisdate: {
        type: Date,
        default: Date.now
      }
    }]
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
