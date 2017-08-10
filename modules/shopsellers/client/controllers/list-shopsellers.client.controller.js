(function () {
  'use strict';

  angular
    .module('shopsellers')
    .controller('ShopsellersListController', ShopsellersListController);

  ShopsellersListController.$inject = ['ShopsellersService'];

  function ShopsellersListController(ShopsellersService) {
    var vm = this;

    vm.shopsellers = ShopsellersService.query();
  }
}());
