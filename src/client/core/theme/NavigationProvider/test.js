import assert from 'assert';
import Injector from 'evoozer/injector';
import NavigationProvider from './NavigationProvider';

const strictEqual = assert.strictEqual.bind(assert);


describe('NavigationProvider', function() {

  describe('#constructor', function() {

    it('should be an function', function() {
      strictEqual(typeof NavigationProvider, 'function');
    });

    it('should return an instance of NavigationProvider', function() {
      const navigationProvider = new NavigationProvider();
      strictEqual(navigationProvider instanceof NavigationProvider, true);
    });

    it('$inject should equals ["$invoke"]', function() {
      strictEqual(JSON.stringify(NavigationProvider.$inject), JSON.stringify(['$invoke']));
    });

  });

  describe('#setCheckoutElement', function() {

    it('should be a function', function () {
      const navigationProvider = new NavigationProvider();
      strictEqual(typeof navigationProvider.setCheckoutElement, 'function');
    });

    it('should return itself', function () {
      const navigationProvider = new NavigationProvider();
      const Element = () => null;
      const result = navigationProvider.setCheckoutElement(Element);
      strictEqual(result, navigationProvider);
    });

  });


  describe('#setSearchElement', function() {

    it('should be a function', function () {
      const navigationProvider = new NavigationProvider();
      strictEqual(typeof navigationProvider.setSearchElement, 'function');
    });

    it('should return itself', function () {
      const navigationProvider = new NavigationProvider();
      const Element = () => null;
      const result = navigationProvider.setSearchElement(Element);
      strictEqual(result, navigationProvider);
    });

  });



  describe('#setAccountElement', function() {

    it('should be a function', function () {
      const navigationProvider = new NavigationProvider();
      strictEqual(typeof navigationProvider.setAccountElement, 'function');
    });

    it('should return itself if', function () {
      const navigationProvider = new NavigationProvider();
      const Element = () => null;
      const result = navigationProvider.setAccountElement(Element);
      strictEqual(result, navigationProvider);
    });

  });

  describe('#setProductCategoryMenuSelector', function() {

    it('should be a function', function () {
      const navigationProvider = new NavigationProvider();
      strictEqual(typeof navigationProvider.setProductCategoryMenuSelector, 'function');
    });

    it('should return itself', function () {
      const navigationProvider = new NavigationProvider();
      const selector = () => null;
      const result = navigationProvider.setProductCategoryMenuSelector(selector);
      strictEqual(result, navigationProvider);
    });

  });

  describe('#configure', function() {

    it('should be a function', function () {
      const navigationProvider = new NavigationProvider();
      strictEqual(typeof navigationProvider.configure, 'function');
    });

    it('should return itself if invoked with an function', function () {
      const navigationProvider = new NavigationProvider();
      const fn = () => null;
      strictEqual(navigationProvider.configure(fn), navigationProvider);
    });

  });

  describe('#$get', function() {

    it('should be an function', function() {
      const navigationProvider = new NavigationProvider();
      strictEqual(typeof navigationProvider.$get, 'function');
    });

    it('should return a promise', function(next) {
      const navigationProvider = new NavigationProvider();
      navigationProvider.$get()
        .then(next.bind(null, null), next.bind(null, null))
    });

   it('should resolve all configure', function(next) {
      let invokeHistory = [],
          injector = new Injector(),
          $invoke = injector.invoke.bind(injector),
          navigationProvider = new NavigationProvider($invoke);

      navigationProvider.configure(function() {
        invokeHistory.push('simple');
      });

      navigationProvider.configure(['dependency', function(dependency) {
        invokeHistory.push(dependency);
      }]);

      injector.constant('dependency', 'complex');

      const onResolve = () => {
        strictEqual(JSON.stringify(invokeHistory), JSON.stringify(['simple', 'complex']));
      };

      navigationProvider.$get()
        .then(onResolve)
        .then(next, next);

    });

    it('should resolve to n object with all elements set', function(next) {
      const injector = new Injector();
      const $invoke = injector.invoke.bind(injector);
      const navigationProvider = new NavigationProvider($invoke);

      const searchElement = () => null;
      const accountElement = () => null;
      const checkoutElement = () => null;
      const productCategoryMenuSelector = () => null;

      navigationProvider
        .setSearchElement(searchElement)
        .setAccountElement(accountElement)
        .setCheckoutElement(checkoutElement)
        .setProductCategoryMenuSelector(productCategoryMenuSelector);

      const onResolve = (obj) => {
        strictEqual(obj.CheckoutElement, checkoutElement);
        strictEqual(obj.AccountElement, accountElement);
        strictEqual(obj.SearchElement, searchElement);
        strictEqual(obj.productCategoryMenuSelector, productCategoryMenuSelector);
      };

      navigationProvider.$get()
        .then(onResolve)
        .then(next, next);

    });

  });

});