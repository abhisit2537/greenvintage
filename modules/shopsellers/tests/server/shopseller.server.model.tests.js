'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shopseller = mongoose.model('Shopseller');

/**
 * Globals
 */
var user,
  shopseller;

/**
 * Unit tests
 */
describe('Shopseller Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      shopseller = new Shopseller({
        name: 'Shopseller Name',
        email:'Shopseller email',
        tel: 'Shopseller tel',
        img:{
          url:'imgUrl',
          id:'imgId'
        },
        coverimg:{
          url:'imgUrl',
          id:'imgId'
        },
        detail:'Shopseller detail',
        review:[{
          comment:'Review comment',
          rate:5,
          user:user
        }],
        rate:5,
        historylog:[{
          customerid:user,
         historydate:new Date('2017-04-22')
        }],


        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return shopseller.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      shopseller.name = '';

      return shopseller.save(function(err) {
        should.exist(err);
        done();
      });
    });

it('should be able to show an error when try to save without tel', function(done) {
      shopseller.tel = '';

      return shopseller.save(function(err) {
        should.exist(err);
        done();
      });
    });

  });

  afterEach(function(done) {
    Shopseller.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
