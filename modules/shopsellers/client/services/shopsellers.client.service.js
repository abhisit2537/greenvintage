// Shopsellers service used to communicate Shopsellers REST endpoints
(function () {
  'use strict';

  angular
    .module('shopsellers')
    .factory('ShopsellersService', ShopsellersService);

  ShopsellersService.$inject = ['$resource'];

  function ShopsellersService($resource) {
    return $resource('api/shopsellers/:shopsellerId', {
      shopsellerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
