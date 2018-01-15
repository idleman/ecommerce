import assert from 'assert';
import Injector from '../../../injector';
import StoreProvider from './StoreProvider';

const strictEqual = assert.strictEqual.bind(assert);


describe('StoreProvider', function() {

  describe('#constructor', function() {

    it('should be an function', function() {
      strictEqual(typeof StoreProvider, 'function');
    });

    it('should return an instance of StoreProvider', function() {
      const storeProvider = new StoreProvider();
      strictEqual(storeProvider instanceof StoreProvider, true);
    });

    it('$inject should equals ["$invoke"]', function() {
      strictEqual(JSON.stringify(StoreProvider.$inject), JSON.stringify(['$invoke']));
    });

  });

  describe('#reducer', function() {

    it('should be a function', function () {
      const storeProvider = new StoreProvider();
      strictEqual(typeof storeProvider.reducer, 'function');
    });

    it('should return itself if invoked with an (string, function)', function () {
      const storeProvider = new StoreProvider();
      const reducer = (state, action) => state;
      strictEqual(storeProvider.reducer('data', reducer), storeProvider);
    });

    it('should be settable', function () {
      const storeProvider = new StoreProvider();
      const reducer = (state, action) => state;
      storeProvider.reducer('data', reducer);
      strictEqual(storeProvider.reducer('data'), reducer);
    });

  });

  describe('#enhancer', function() {

    it('should be a function', function () {
      const storeProvider = new StoreProvider();
      strictEqual(typeof storeProvider.enhancer, 'function');
    });

    it('should return itself if invoked with an (function)', function () {
      const storeProvider = new StoreProvider();
      const enhancer = () => null;
      strictEqual(storeProvider.enhancer(enhancer), storeProvider);
    });

    it('should be settable', function () {
      const storeProvider = new StoreProvider();
      const enhancer = () => null;
      storeProvider.enhancer(enhancer);
      strictEqual(storeProvider.enhancer(), enhancer);
    });

  });


  describe('#configure', function() {

    it('should be a function', function () {
      const storeProvider = new StoreProvider();
      strictEqual(typeof storeProvider.configure, 'function');
    });

    it('should return itself if invoked with an function', function () {
      const storeProvider = new StoreProvider();
      const fn = () => null;
      strictEqual(storeProvider.configure(fn), storeProvider);
    });

  });

  describe('#$get', function() {

    it('should be an function', function() {
      const storeProvider = new StoreProvider();
      strictEqual(typeof storeProvider.$get, 'function');
    });

    it('should return a promise', function() {
      let storeProvider = new StoreProvider(),
          promise = storeProvider.$get();

      strictEqual(typeof promise.then, 'function');
    });

   it('should resolve all configure', function(next) {
      let invokeHistory = [],
          injector = new Injector(),
          $invoke = injector.invoke.bind(injector),
          storeProvider = new StoreProvider($invoke);

      storeProvider.configure(function() {
        invokeHistory.push('simple');
      });

      storeProvider.configure(['dependency', function(dependency) {
        invokeHistory.push(dependency);
      }]);

      injector.constant('dependency', 'complex');

      const onResolve = () => {
        strictEqual(JSON.stringify(invokeHistory), JSON.stringify(['simple', 'complex']));
      };

      storeProvider.$get()
        .then(onResolve)
        .then(next, next);

    });

    it('should resolve to to a redux-store like object', function(next) {
      let injector = new Injector(),
          $invoke = injector.invoke.bind(injector),
          storeProvider = new StoreProvider($invoke);

      const onResolve = (store) => {
        strictEqual(typeof store.getState, 'function');
        strictEqual(typeof store.dispatch, 'function');
        strictEqual(typeof store.subscribe, 'function');
        strictEqual(typeof store.replaceReducer, 'function');
      };

      storeProvider.$get()
        .then(onResolve)
        .then(next, next);

    });

  });

});