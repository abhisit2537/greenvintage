(function () {
  'use strict';

  angular
    .module('shopsellers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('shopsellers', {
        abstract: true,
        url: '/shopsellers',
        template: '<ui-view/>'
      })
      .state('shopsellers.list', {
        url: '',
        templateUrl: 'modules/shopsellers/client/views/list-shopsellers.client.view.html',
        controller: 'ShopsellersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Shopsellers List'
        }
      })
      .state('shopsellers.create', {
        url: '/create',
        templateUrl: 'modules/shopsellers/client/views/form-shopseller.client.view.html',
        controller: 'ShopsellersController',
        controllerAs: 'vm',
        resolve: {
          shopsellerResolve: newShopseller
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Shopsellers Create'
        }
      })
      .state('shopsellers.edit', {
        url: '/:shopsellerId/edit',
        templateUrl: 'modules/shopsellers/client/views/form-shopseller.client.view.html',
        controller: 'ShopsellersController',
        controllerAs: 'vm',
        resolve: {
          shopsellerResolve: getShopseller
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Shopseller {{ shopsellerResolve.name }}'
        }
      })
      .state('shopsellers.view', {
        url: '/:shopsellerId',
        templateUrl: 'modules/shopsellers/client/views/view-shopseller.client.view.html',
        controller: 'ShopsellersController',
        controllerAs: 'vm',
        resolve: {
          shopsellerResolve: getShopseller
        },
        data: {
          pageTitle: 'Shopseller {{ shopsellerResolve.name }}'
        }
      });
  }

  getShopseller.$inject = ['$stateParams', 'ShopsellersService'];

  function getShopseller($stateParams, ShopsellersService) {
    return ShopsellersService.get({
      shopsellerId: $stateParams.shopsellerId
    }).$promise;
  }

  newShopseller.$inject = ['ShopsellersService'];

  function newShopseller(ShopsellersService) {
    return new ShopsellersService();
  }
}());
