(function () {
  'use strict';

  angular
    .module('reportsummarymonthlies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Reportsummarymonthlies',
      state: 'reportsummarymonthlies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'reportsummarymonthlies', {
      title: 'List Reportsummarymonthlies',
      state: 'reportsummarymonthlies.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'reportsummarymonthlies', {
      title: 'Create Reportsummarymonthly',
      state: 'reportsummarymonthlies.create',
      roles: ['user']
    });
  }
}());
