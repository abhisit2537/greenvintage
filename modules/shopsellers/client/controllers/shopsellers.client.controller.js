(function () {
  'use strict';

  // Shopsellers controller
  angular
    .module('shopsellers')
    .controller('ShopsellersController', ShopsellersController);

  ShopsellersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'shopsellerResolve'];

  function ShopsellersController ($scope, $state, $window, Authentication, shopseller) {
    var vm = this;

    vm.authentication = Authentication;
    vm.shopseller = shopseller;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Shopseller
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.shopseller.$remove($state.go('shopsellers.list'));
      }
    }

    // Save Shopseller
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.shopsellerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.shopseller._id) {
        vm.shopseller.$update(successCallback, errorCallback);
      } else {
        vm.shopseller.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('shopsellers.view', {
          shopsellerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
