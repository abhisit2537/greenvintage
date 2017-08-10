(function () {
  'use strict';

  angular
    .module('shopsellers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Shopsellers',
      state: 'shopsellers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'shopsellers', {
      title: 'List Shopsellers',
      state: 'shopsellers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'shopsellers', {
      title: 'Create Shopseller',
      state: 'shopsellers.create',
      roles: ['user']
    });
  }
}());
