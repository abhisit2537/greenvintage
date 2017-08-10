(function () {
  'use strict';

  describe('Shopsellers Route Tests', function () {
    // Initialize global variables
    var $scope,
      ShopsellersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ShopsellersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ShopsellersService = _ShopsellersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('shopsellers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/shopsellers');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ShopsellersController,
          mockShopseller;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('shopsellers.view');
          $templateCache.put('modules/shopsellers/client/views/view-shopseller.client.view.html', '');

          // create mock Shopseller
          mockShopseller = new ShopsellersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Shopseller Name'
          });

          // Initialize Controller
          ShopsellersController = $controller('ShopsellersController as vm', {
            $scope: $scope,
            shopsellerResolve: mockShopseller
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:shopsellerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.shopsellerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            shopsellerId: 1
          })).toEqual('/shopsellers/1');
        }));

        it('should attach an Shopseller to the controller scope', function () {
          expect($scope.vm.shopseller._id).toBe(mockShopseller._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/shopsellers/client/views/view-shopseller.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ShopsellersController,
          mockShopseller;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('shopsellers.create');
          $templateCache.put('modules/shopsellers/client/views/form-shopseller.client.view.html', '');

          // create mock Shopseller
          mockShopseller = new ShopsellersService();

          // Initialize Controller
          ShopsellersController = $controller('ShopsellersController as vm', {
            $scope: $scope,
            shopsellerResolve: mockShopseller
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.shopsellerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/shopsellers/create');
        }));

        it('should attach an Shopseller to the controller scope', function () {
          expect($scope.vm.shopseller._id).toBe(mockShopseller._id);
          expect($scope.vm.shopseller._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/shopsellers/client/views/form-shopseller.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ShopsellersController,
          mockShopseller;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('shopsellers.edit');
          $templateCache.put('modules/shopsellers/client/views/form-shopseller.client.view.html', '');

          // create mock Shopseller
          mockShopseller = new ShopsellersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Shopseller Name'
          });

          // Initialize Controller
          ShopsellersController = $controller('ShopsellersController as vm', {
            $scope: $scope,
            shopsellerResolve: mockShopseller
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:shopsellerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.shopsellerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            shopsellerId: 1
          })).toEqual('/shopsellers/1/edit');
        }));

        it('should attach an Shopseller to the controller scope', function () {
          expect($scope.vm.shopseller._id).toBe(mockShopseller._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/shopsellers/client/views/form-shopseller.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
