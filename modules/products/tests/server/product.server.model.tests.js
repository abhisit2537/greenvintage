'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product');

/**
 * Globals
 */
var user,
  product;

/**
 * Unit tests
 */
describe('Product Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });
    // var product1 = {

    // };
    var shipping = {
      name: 'ems'
    };
    var payment = [{
      name: 'payment name'
    }];
    var shopseller = {
      name: 'shopseller name',
      email: 'shopseller email',
      tel: 'shopseller tel',
      img: {
        url: 'imageUrl',
        id: 'imageID'
      },
      coverimg: {
        url: 'imageUrl',
        id: 'imageID'
      },
      order: [],
      decs: 'shopseller desc',
      review: [],
      rate: 5,
      historylog: []
    };
    user.save(function () {
      product = new Product({
        shopseller: shopseller,
        name: 'product name',
        detail: 'product detail',
        unitprice: 100,
        img: [{
          url: 'imageUrl',
          id: 'imageID'
        }],
        shipping: shipping,
        review: [],
        rate: 5,
        preparedays:5,
        qa: [{
          question: 'Qa question',
          answer: 'Qa answer'
        }],
        promotion: [{
          name: 'promotion name',
          desc: 'promotion description',
          code: 'promotion code',
          startdate: new Date('2017-04-20'),
          enddate: new Date('2017-04-22')
        }],
        favorite: [{
          customerid: user,
          favdate: new Date('2017-04-22')

        }],
        historyLog: [{
          customerid: user,
          hisdate: new Date('2017-04-22')
        }],
        stock: {
          stockvalue: [{
            in: 10,
            out: 10,
            stockdate: new Date('2017-04-22')
          }],
          sumin: 10,
          sumout: 10,
          amount: 10
        },
        payment: payment,
        qty: 10,
        size: {
          issize: true,
          detail: {
            desc: 'detail size',
            sizedetail: [{
              name: 'sizedetail name',
              qty: 10
            }],
          },
        },

        category: [{
          name: 'category name',
          desc: 'category description',
          subcategory: [{
            name: 'subcategory name',
            desc: 'subcategory description'
          }],
        }],
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return product.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      product.name = '';

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

    //  it('should be able to show an error when try to save without shopseller', function (done) {
    //   product.shopseller = [];

    //   return product.save(function (err) {
    //     should.exist(err);
    //     done();
    //   });
    // });

    it('should be able to show an error when try to save without unitprice', function (done) {
      product.unitprice = null;

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

it('should be able to show an error when try to save without img', function (done) {
      product.img = [];

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

//     it('should be able to show an error when try to save without shipping', function (done) {
//       product.shipping = [];

//       return product.save(function (err) {
//         should.exist(err);
//         done();
//       });
//     });

// it('should be able to show an error when try to save without payment', function (done) {
//       product.payment = [];

//       return product.save(function (err) {
//         should.exist(err);
//         done();
//       });
//     });

    it('should be able to show an error when try to save without category', function (done) {
      product.category = [];

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

     it('should be able to show an error when try to save without preparedays', function (done) {
      product.preparedays = null;

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });

  });

  afterEach(function (done) {
    Product.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
