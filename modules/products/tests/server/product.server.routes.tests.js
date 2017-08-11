'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shipping = mongoose.model('Shipping'),
  Product = mongoose.model('Product'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  shipping,
  product;

/**
 * Product routes tests
 */
describe('Product CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    shipping = new Shipping({
      name: 'ems',
      detail: 'Shipping detail',
      day: 5
    });
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
    // Save a user to the test db and create new Product
    shipping.save(function (err, result) {
      user.save(function () {
        product = {
          shopseller: shopseller,
          name: 'product name',
          detail: 'product detail',
          unitprice: 100,
          img: [{
            url: 'imageUrl',
            id: 'imageID'
          }],
          shippings: [{
            shipping: shipping,
            shippingprice: 0,
            shippingstartdate: new Date('2017-04-20'),
            shippingenddate: new Date('2017-04-20')
          }],
          review: [],
          rate: 5,
          preparedays: 5,
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
        };

        done();
      });
    });
  });

  it('should be able to save a Product if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Product
        agent.post('/api/products')
          .send(product)
          .expect(200)
          .end(function (productSaveErr, productSaveRes) {
            // Handle Product save error
            if (productSaveErr) {
              return done(productSaveErr);
            }

            // Get a list of Products
            agent.get('/api/products')
              .end(function (productsGetErr, productsGetRes) {
                // Handle Products save error
                if (productsGetErr) {
                  return done(productsGetErr);
                }

                // Get Products list
                var products = productsGetRes.body;

                // Set assertions
                (products[0].user._id).should.equal(userId);
                (products[0].name).should.match('product name');
                (products[0].unitprice).should.match(100);
                (products[0].img[0].id).should.match('imageID');
                (products[0].img[0].url).should.match('imageUrl');
                (products[0].preparedays).should.match(5);
                (products[0].shippings[0].shipping.name).should.match('ems');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Product if not logged in', function (done) {
    agent.post('/api/products')
      .send(product)
      .expect(403)
      .end(function (productSaveErr, productSaveRes) {
        // Call the assertion callback
        done(productSaveErr);
      });
  });

  it('should not be able to save an Product if no name is provided', function (done) {
    // Invalidate name field
    product.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Product
        agent.post('/api/products')
          .send(product)
          .expect(400)
          .end(function (productSaveErr, productSaveRes) {
            // Set message assertion
            (productSaveRes.body.message).should.match('Please fill Product name');

            // Handle Product save error
            done(productSaveErr);
          });
      });
  });

  it('should be able to update an Product if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Product
        agent.post('/api/products')
          .send(product)
          .expect(200)
          .end(function (productSaveErr, productSaveRes) {
            // Handle Product save error
            if (productSaveErr) {
              return done(productSaveErr);
            }

            // Update Product name
            product.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Product
            agent.put('/api/products/' + productSaveRes.body._id)
              .send(product)
              .expect(200)
              .end(function (productUpdateErr, productUpdateRes) {
                // Handle Product update error
                if (productUpdateErr) {
                  return done(productUpdateErr);
                }

                // Set assertions
                (productUpdateRes.body._id).should.equal(productSaveRes.body._id);
                (productUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Products if not signed in', function (done) {
    // Create new Product model instance
    var productObj = new Product(product);

    // Save the product
    productObj.save(function () {
      // Request Products
      request(app).get('/api/products')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Product if not signed in', function (done) {
    // Create new Product model instance
    var productObj = new Product(product);

    // Save the Product
    productObj.save(function () {
      request(app).get('/api/products/' + productObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', product.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Product with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/products/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Product is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Product which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Product
    request(app).get('/api/products/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Product with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Product if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Product
        agent.post('/api/products')
          .send(product)
          .expect(200)
          .end(function (productSaveErr, productSaveRes) {
            // Handle Product save error
            if (productSaveErr) {
              return done(productSaveErr);
            }

            // Delete an existing Product
            agent.delete('/api/products/' + productSaveRes.body._id)
              .send(product)
              .expect(200)
              .end(function (productDeleteErr, productDeleteRes) {
                // Handle product error error
                if (productDeleteErr) {
                  return done(productDeleteErr);
                }

                // Set assertions
                (productDeleteRes.body._id).should.equal(productSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Product if not signed in', function (done) {
    // Set Product user
    product.user = user;

    // Create new Product model instance
    var productObj = new Product(product);

    // Save the Product
    productObj.save(function () {
      // Try deleting Product
      request(app).delete('/api/products/' + productObj._id)
        .expect(403)
        .end(function (productDeleteErr, productDeleteRes) {
          // Set message assertion
          (productDeleteRes.body.message).should.match('User is not authorized');

          // Handle Product error error
          done(productDeleteErr);
        });

    });
  });

  it('should be able to get a single Product that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Product
          agent.post('/api/products')
            .send(product)
            .expect(200)
            .end(function (productSaveErr, productSaveRes) {
              // Handle Product save error
              if (productSaveErr) {
                return done(productSaveErr);
              }

              // Set assertions on new Product
              (productSaveRes.body.name).should.equal(product.name);
              should.exist(productSaveRes.body.user);
              should.equal(productSaveRes.body.user._id, orphanId);

              // force the Product to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Product
                    agent.get('/api/products/' + productSaveRes.body._id)
                      .expect(200)
                      .end(function (productInfoErr, productInfoRes) {
                        // Handle Product error
                        if (productInfoErr) {
                          return done(productInfoErr);
                        }

                        // Set assertions
                        (productInfoRes.body._id).should.equal(productSaveRes.body._id);
                        (productInfoRes.body.name).should.equal(product.name);
                        should.equal(productInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    Shipping.remove().exec(function () {
      User.remove().exec(function () {
        Product.remove().exec(done);
      });
    });
  });
});
