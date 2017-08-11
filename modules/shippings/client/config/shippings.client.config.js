(function () {
  'use strict';

  angular
    .module('shippings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Shippings',
      state: 'shippings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'shippings', {
      title: 'List Shippings',
      state: 'shippings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'shippings', {
      title: 'Create Shipping',
      state: 'shippings.create',
      roles: ['user']
    });
  }
}());
