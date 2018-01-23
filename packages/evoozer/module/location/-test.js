import assert from 'assert';
import Module from '../module'
import locationModule from './location';

const strictEqual = assert.strictEqual.bind(assert);

describe('module/location', function() {

  function createLocationSourceHandler(data = { url: '', state: {}, title: '' }) {
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
      },
      replaceLocation: (state, title, url) => {
        data.title = title;
        data.state = state;
        data.url = url;
        subscribers.forEach(cb => cb(url, state, title));
      }
    };
  }

  function createModule() {
    return new Module('', [ locationModule ]);
  }
  
  it('should export an WoodFire module instance', function() {
    strictEqual(locationModule instanceof Module, true);
  });
  
  it('should export "locationProvider"', function(next) {
    let module = createModule();

    module.config(['locationProvider', function(locationProvider) {
      strictEqual(typeof locationProvider, 'object');
    }]);

    const instance = module.createInstance();
    instance.initiate()
      .then(next.bind(null, null), next);
  });

  it('should be able to receive "location" and modify its path, state and title"', function(next) {
    let module = createModule();
    let locationSourceHandler = createLocationSourceHandler();
    module.config(['locationProvider', function(locationProvider) {
      locationSourceHandler.setLocation({}, 'title', 'http://example.com/a/b/c?query#hash');
      locationProvider.setLocationSourceHandler(locationSourceHandler);
    }]);

    module.run(['location', function(location) {
      let url = location.url();
      strictEqual(url.pathname, '/a/b/c');
      strictEqual(url.search, '?query');
      location.set({ title: 'Start page', state: { name: 'John Doe' }, pathname: '/index' });
      strictEqual(location.url().pathname, '/index');
      strictEqual(location.title(), 'Start page');
      strictEqual(location.state().name, 'John Doe');
    }]);

    const instance = module.createInstance();
    instance.initiate()
      .then(next.bind(null, null), next);
  });

  it('should be able to receive "location" and replace its path, state and title"', function(next) {
    let module = createModule();
    let locationSourceHandler = createLocationSourceHandler();
    module.config(['locationProvider', function(locationProvider) {
      locationSourceHandler.setLocation({}, 'title', 'http://example.com/a/b/c?query#hash'); // Initial
      locationProvider.setLocationSourceHandler(locationSourceHandler);
    }]);

    module.run(['location', function(location) {
      let url = location.url();
      strictEqual(url.pathname, '/a/b/c');
      strictEqual(url.search, '?query');
      location.replace({ title: 'Start page', state: { name: 'John Doe' }, pathname: '/index' });
      url = location.url();
      strictEqual(url.pathname, '/index');
      strictEqual(url.search, '?query');
      strictEqual(location.title(), 'Start page');
      strictEqual(location.state().name, 'John Doe');
    }]);

    const instance = module.createInstance();
    instance.initiate()
      .then(next.bind(null, null), next);
  });

  it('should support .use()', function(next) {
    let module = createModule();
    let locationSourceHandler = createLocationSourceHandler();
    module.config(['locationProvider', function(locationProvider) {
      locationSourceHandler.setLocation({}, 'title', 'http://example.com/a/b/c?query#hash'); // Initial
      locationProvider.setLocationSourceHandler(locationSourceHandler);
      locationProvider.use(function(data) {
        return (data.pathname === '/forbidden')? Object.assign(data, { pathname: '/allowed' }) : data;
      });
    }]);

    module.run(['location', function(location) {
      location.set({ pathname: '/forbidden' });
      strictEqual(location.url().pathname, '/allowed');
    }]);

    const instance = module.createInstance();
    instance.initiate()
      .then(next.bind(null, null), next);
  });

});