'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },

  detail: String,
  unitprice: {
    type: Number,
    required: 'Please fill Product unitprice',
  },

  img: {
    required: 'Please fill Product img',
    type: [{
      url: String,
      id: String
    }]
  },
  qa: {
    type: [{
      question: String,
      answer: String
    }]
  },

  review: {
    type: [{
      comment: String,
      rate: Number,
      user: {
        type: Schema.ObjectId,
        ref: 'User'
      },
    }]
  },

  promotions: {
    type: [{
      name: String,
      desc: String,
      code: String,
      startdate: Date,
      enddate: Date
    }]
  },

  favorite: {
    type: [{
      customerid: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      favdate: {
        type: Date,
        default: Date.now
      }
    }]
  },

  historyLog: {
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
  stock: {
    sumin: Number,
    sumout: Number,
    amount: Number,
    type: [{
      in: Number,
      out: Number,
      stockdate: {
        type: Date,
        default: Date.now
      }
    }],
  },
  category: {
    required: 'Please fill Product unitprice',
    type: [{
      name: String,
      desc: String,
      subcategory: [{
        name: String,
        desc: String
      }],
    }]
  },
  // shopseller: {
  //   type: Schema.ObjectId,
  //   ref: 'Shopseller'
  // },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);
