import assert from 'assert';
import Injector from '../../../injector';
import LocationService from '../LocationService';
import LocationProvider from './LocationProvider';

const strictEqual = assert.strictEqual.bind(assert);


describe('location/LocationProvider', function() {

  describe('#constructor', function() {

    it('should be a function', function() {
      strictEqual(typeof LocationProvider, 'function');
    });

    it('should construct a LocationProvider instance', function() {
      let locationProvider = new LocationProvider();
      strictEqual(locationProvider instanceof LocationProvider, true);
    });

    it('$inject should equals ["$invoke", "$construct"]', function() {
      let locationProvider = new LocationProvider();
      strictEqual(JSON.stringify(LocationProvider.$inject), JSON.stringify(["$invoke", "$construct"]));
    });

  });

  describe('#use', function() {

    it('should be a function', function () {
      let locationProvider = new LocationProvider();
      strictEqual(typeof locationProvider.use, 'function');
    });

    it('should return itself when provided with an function', function() {
      const handler = () => null;
      let locationProvider = new LocationProvider();
      strictEqual(locationProvider.use(handler), locationProvider);
    });

  });

  function createLocationSourceHandler() {
    return {
      onLocationChange: () => null,
      setLocation: () => null
    };
  }

  describe('#setLocationSourceHandler', function() {

    it('should be a function', function() {
      let locationProvider = new LocationProvider();
      strictEqual(typeof locationProvider.setLocationSourceHandler, 'function');
    });

    it('should return itself when provided with an object', function() {
      const handler = createLocationSourceHandler();
      let locationProvider = new LocationProvider();
      strictEqual(locationProvider.setLocationSourceHandler(handler), locationProvider);
    });

  });

  describe('#configure', function() {

    it('should be a function', function() {
      let locationProvider = new LocationProvider();
      strictEqual(typeof locationProvider.configure, 'function');
    });

    it('should return itself when provided with an function', function() {
      const handler = () => null;
      let locationProvider = new LocationProvider();
      strictEqual(locationProvider.configure(handler), locationProvider);
    });

  });

  describe('#$get', function() {

    it('should be a function', function() {
      let locationProvider = new LocationProvider();
      strictEqual(typeof locationProvider.$get, 'function');
    });


    it('should return a promise', function() {
      const injector = new Injector();
      const $invoke = injector.invoke.bind(injector);
      const $construct = injector.construct.bind(injector);
      const locationProvider = new LocationProvider($invoke, $construct);
      const promise = locationProvider.$get();

      strictEqual(typeof promise.then, 'function');
      promise.then(null, null);
    });

    it('should resolve to an instance of LocationService', function(next) {
      const injector = new Injector();
      const $invoke = injector.invoke.bind(injector);
      const $construct = injector.construct.bind(injector);
      const locationProvider = new LocationProvider($invoke, $construct);

      const onResolve = (location) => {
        strictEqual(location instanceof LocationService, true);
      };

      locationProvider.setLocationSourceHandler(createLocationSourceHandler());
      locationProvider.$get()
        .then(onResolve)
        .then(next, next);
    });

    it('should resolve all configure handlers', function(next) {
      const injector = new Injector();
      const $invoke = injector.invoke.bind(injector);
      const $construct = injector.construct.bind(injector);
      const locationProvider = new LocationProvider($invoke, $construct);
      let configured = false;

      locationProvider.configure(function() {
        configured = true;
      });

      const onResolve = () => {
        strictEqual(configured, true);
      };
      locationProvider.setLocationSourceHandler(createLocationSourceHandler());
      locationProvider.$get()
        .then(onResolve)
        .then(next, next);

    });

  });

});