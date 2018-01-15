import { strictEqual, notStrictEqual, throws } from 'assert';
import { renderToString } from 'react-dom/server';
import View from 'react';
import ReactRouterProvider from './provider';
import Injector from './../../../injector';
import LocationProvider from './../../location/provider';
import LocationService from './../../location/service';

describe('ReactRouterProvider', function() {
  function createLocationSourceHandler(data = { url: '', state: null, title: '' }) {
    let subscribers = [];
    return {
      onLocationChange: (cb) => {
        cb(data.url, data.state, data.title);
        subscribers.push(cb);
      },
      setLocation: (state, title, url) => {
        data.title = title;
        data.state = state;
        data.url = url;
        subscribers.forEach(cb => cb(url, state, title));
      }
    };
  }

  function createLocation() {
    return new LocationService(createLocationSourceHandler());
  }

  describe('#constructor', function() {

    it('should be a function', function() {
      strictEqual(typeof ReactRouterProvider, 'function');
    });

    it('should construct a ReactRouterProvider instance', function() {
      const reactRouterProvider = new ReactRouterProvider(null, new LocationProvider());
      strictEqual(reactRouterProvider instanceof ReactRouterProvider, true);
    });

    it('$inject should equals ["$invoke", "locationProvider"]', function() {
      strictEqual(JSON.stringify(ReactRouterProvider.$inject), JSON.stringify(["$invoke", "locationProvider"]));
    });

  });

  describe('#configure', function() {

    it('should be a function', function() {
      let reactRouterProvider = new ReactRouterProvider(null, new LocationProvider());
      strictEqual(typeof reactRouterProvider.configure, 'function');
    });

    it('should return itself when provided with an function', function() {
      const handler = () => null;
      let reactRouterProvider = new ReactRouterProvider(null, new LocationProvider());
      strictEqual(reactRouterProvider.configure(handler), reactRouterProvider);
    });

  });

  describe('#when', function() {

    it('should be a function', function() {
      let reactRouterProvider = new ReactRouterProvider(null, new LocationProvider());
      strictEqual(typeof reactRouterProvider.when, 'function');
    });

    it('should return itself when provided with an coalition and a rule', function() {
      const condition = '/';
      const rule = 'component/test';
      let reactRouterProvider = new ReactRouterProvider(null, new LocationProvider());
      strictEqual(reactRouterProvider.when(condition, rule), reactRouterProvider);
    });

  });

  describe('#getReactRouterComponent', function() {

    it('should be a function', function() {
      let reactRouterProvider = new ReactRouterProvider(null, new LocationProvider());
      strictEqual(typeof reactRouterProvider.getReactRouterComponent, 'function');
    });

    it('should throw an exception if default constructed', function() {
      let reactRouterProvider = new ReactRouterProvider(null, new LocationProvider());
      throws(reactRouterProvider.getReactRouterComponent.bind(reactRouterProvider));
    });

    it('should return a React.Component', function() {
      let reactRouterProvider = new ReactRouterProvider(null, new LocationProvider(), createLocation()),
          ReactRouterComponent = reactRouterProvider.getReactRouterComponent();

      strictEqual(View.Component.isPrototypeOf(ReactRouterComponent), true);
    });

  });

  describe('#$get', function() {

    it('should be a function', function() {
      let reactRouterProvider = new ReactRouterProvider(null, new LocationProvider());
      strictEqual(typeof reactRouterProvider.$get, 'function');
    });

    it('should return a promise', function() {
      let reactRouterProvider = new ReactRouterProvider(null, new LocationProvider()),
          promise = reactRouterProvider.$get();

      strictEqual(typeof promise.then, 'function');
    });

    it('should resolve all configure handlers', function(next) {
      let injector = new Injector(),
          $invoke = injector.invoke.bind(injector),
          reactRouterProvider = new ReactRouterProvider($invoke, new LocationProvider()),
          configured = false;

      reactRouterProvider.configure(function() {
        configured = true;
      });

      const onResolve = () => {
        strictEqual(configured, true);
        next();
      };

      injector.set('location', createLocation());
      reactRouterProvider.$get()
        .then(onResolve, next)
        .then(null, next);

    });

  });

});