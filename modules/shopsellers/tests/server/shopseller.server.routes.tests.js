'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shopseller = mongoose.model('Shopseller'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  shopseller;

/**
 * Shopseller routes tests
 */
describe('Shopseller CRUD tests', function () {

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

    // Save a user to the test db and create new Shopseller
    user.save(function () {
      shopseller = {
        name: 'Shopseller name'
      };

      done();
    });
  });

  it('should be able to save a Shopseller if logged in', function (done) {
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

        // Save a new Shopseller
        agent.post('/api/shopsellers')
          .send(shopseller)
          .expect(200)
          .end(function (shopsellerSaveErr, shopsellerSaveRes) {
            // Handle Shopseller save error
            if (shopsellerSaveErr) {
              return done(shopsellerSaveErr);
            }

            // Get a list of Shopsellers
            agent.get('/api/shopsellers')
              .end(function (shopsellersGetErr, shopsellersGetRes) {
                // Handle Shopsellers save error
                if (shopsellersGetErr) {
                  return done(shopsellersGetErr);
                }

                // Get Shopsellers list
                var shopsellers = shopsellersGetRes.body;

                // Set assertions
                (shopsellers[0].user._id).should.equal(userId);
                (shopsellers[0].name).should.match('Shopseller name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Shopseller if not logged in', function (done) {
    agent.post('/api/shopsellers')
      .send(shopseller)
      .expect(403)
      .end(function (shopsellerSaveErr, shopsellerSaveRes) {
        // Call the assertion callback
        done(shopsellerSaveErr);
      });
  });

  it('should not be able to save an Shopseller if no name is provided', function (done) {
    // Invalidate name field
    shopseller.name = '';

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

        // Save a new Shopseller
        agent.post('/api/shopsellers')
          .send(shopseller)
          .expect(400)
          .end(function (shopsellerSaveErr, shopsellerSaveRes) {
            // Set message assertion
            (shopsellerSaveRes.body.message).should.match('Please fill Shopseller name');

            // Handle Shopseller save error
            done(shopsellerSaveErr);
          });
      });
  });

  it('should be able to update an Shopseller if signed in', function (done) {
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

        // Save a new Shopseller
        agent.post('/api/shopsellers')
          .send(shopseller)
          .expect(200)
          .end(function (shopsellerSaveErr, shopsellerSaveRes) {
            // Handle Shopseller save error
            if (shopsellerSaveErr) {
              return done(shopsellerSaveErr);
            }

            // Update Shopseller name
            shopseller.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Shopseller
            agent.put('/api/shopsellers/' + shopsellerSaveRes.body._id)
              .send(shopseller)
              .expect(200)
              .end(function (shopsellerUpdateErr, shopsellerUpdateRes) {
                // Handle Shopseller update error
                if (shopsellerUpdateErr) {
                  return done(shopsellerUpdateErr);
                }

                // Set assertions
                (shopsellerUpdateRes.body._id).should.equal(shopsellerSaveRes.body._id);
                (shopsellerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Shopsellers if not signed in', function (done) {
    // Create new Shopseller model instance
    var shopsellerObj = new Shopseller(shopseller);

    // Save the shopseller
    shopsellerObj.save(function () {
      // Request Shopsellers
      request(app).get('/api/shopsellers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Shopseller if not signed in', function (done) {
    // Create new Shopseller model instance
    var shopsellerObj = new Shopseller(shopseller);

    // Save the Shopseller
    shopsellerObj.save(function () {
      request(app).get('/api/shopsellers/' + shopsellerObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', shopseller.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Shopseller with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/shopsellers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Shopseller is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Shopseller which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Shopseller
    request(app).get('/api/shopsellers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Shopseller with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Shopseller if signed in', function (done) {
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

        // Save a new Shopseller
        agent.post('/api/shopsellers')
          .send(shopseller)
          .expect(200)
          .end(function (shopsellerSaveErr, shopsellerSaveRes) {
            // Handle Shopseller save error
            if (shopsellerSaveErr) {
              return done(shopsellerSaveErr);
            }

            // Delete an existing Shopseller
            agent.delete('/api/shopsellers/' + shopsellerSaveRes.body._id)
              .send(shopseller)
              .expect(200)
              .end(function (shopsellerDeleteErr, shopsellerDeleteRes) {
                // Handle shopseller error error
                if (shopsellerDeleteErr) {
                  return done(shopsellerDeleteErr);
                }

                // Set assertions
                (shopsellerDeleteRes.body._id).should.equal(shopsellerSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Shopseller if not signed in', function (done) {
    // Set Shopseller user
    shopseller.user = user;

    // Create new Shopseller model instance
    var shopsellerObj = new Shopseller(shopseller);

    // Save the Shopseller
    shopsellerObj.save(function () {
      // Try deleting Shopseller
      request(app).delete('/api/shopsellers/' + shopsellerObj._id)
        .expect(403)
        .end(function (shopsellerDeleteErr, shopsellerDeleteRes) {
          // Set message assertion
          (shopsellerDeleteRes.body.message).should.match('User is not authorized');

          // Handle Shopseller error error
          done(shopsellerDeleteErr);
        });

    });
  });

  it('should be able to get a single Shopseller that has an orphaned user reference', function (done) {
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

          // Save a new Shopseller
          agent.post('/api/shopsellers')
            .send(shopseller)
            .expect(200)
            .end(function (shopsellerSaveErr, shopsellerSaveRes) {
              // Handle Shopseller save error
              if (shopsellerSaveErr) {
                return done(shopsellerSaveErr);
              }

              // Set assertions on new Shopseller
              (shopsellerSaveRes.body.name).should.equal(shopseller.name);
              should.exist(shopsellerSaveRes.body.user);
              should.equal(shopsellerSaveRes.body.user._id, orphanId);

              // force the Shopseller to have an orphaned user reference
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

                    // Get the Shopseller
                    agent.get('/api/shopsellers/' + shopsellerSaveRes.body._id)
                      .expect(200)
                      .end(function (shopsellerInfoErr, shopsellerInfoRes) {
                        // Handle Shopseller error
                        if (shopsellerInfoErr) {
                          return done(shopsellerInfoErr);
                        }

                        // Set assertions
                        (shopsellerInfoRes.body._id).should.equal(shopsellerSaveRes.body._id);
                        (shopsellerInfoRes.body.name).should.equal(shopseller.name);
                        should.equal(shopsellerInfoRes.body.user, undefined);

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
    User.remove().exec(function () {
      Shopseller.remove().exec(done);
    });
  });
});
