'use strict';

describe('Shopsellers E2E Tests:', function () {
  describe('Test Shopsellers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/shopsellers');
      expect(element.all(by.repeater('shopseller in shopsellers')).count()).toEqual(0);
    });
  });
});
