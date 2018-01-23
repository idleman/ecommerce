import assert from 'assert';
import LocationService from './LocationService';

const strictEqual = assert.strictEqual.bind(assert);


describe('location/LocationService', function() {

  function createLocationSourceHandler({ url = 'http://localhost:8080/', state = {}, title = '' } = { }) {
    let subscribers = [];
    return {
      onLocationChange: (cb) => {
        cb(url, state, title);
        subscribers.push(cb);
      },
      setLocation: (_state, _title, _url) => {
        title = _title;
        state = _state;
        url = _url;
        subscribers.forEach(cb => cb(url, state, title));
      },
      replaceLocation: (_state, _title, _url) => {
        title = _title;
        state = _state;
        url = _url;
        subscribers.forEach(cb => cb(url, state, title));
      }
    };
  }

  describe('#constructor', function() {
    
    it('should be a function', function() {
      strictEqual(typeof LocationService, 'function');
    });
    
    it('should construct a LocationService instance', function() {
      let locationService = new LocationService(createLocationSourceHandler());
      strictEqual(locationService instanceof LocationService, true);
    });
    
    it('$inject should equals ["$$locationSourceHandler", "$$locationUseList"]', function() {
      let locationService = new LocationService(createLocationSourceHandler());
      strictEqual(JSON.stringify(LocationService.$inject), JSON.stringify(['$$locationSourceHandler', '$$locationUseList']));
    });
    
  });

  describe('#use', function() {

    it('should be a function', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      strictEqual(typeof locationService.use, 'function');
    });

    it('should return itself when provided with an function', function() {
      const handler = () => null;
      let locationService = new LocationService(createLocationSourceHandler());
      strictEqual(locationService.use(handler), locationService);
    });

  });

  describe('#url', function() {

    it('should be a function', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      strictEqual(typeof locationService.url, 'function');
    });

    it('should return an object that implement the "URL" standard', function () {
      const data = { url: 'http://example.com:8080/a/b/c?query=123&b=2#hihi' };
      const $$locationSourceHandler = createLocationSourceHandler(data);
      const locationService = new LocationService($$locationSourceHandler);
      const url = locationService.url();
      strictEqual(typeof url, 'object');
      strictEqual(url.protocol, 'http:');
      strictEqual(url.username, '');
      strictEqual(url.password, '');
      strictEqual(url.hostname, 'example.com');
      strictEqual(url.host, 'example.com:8080');
      strictEqual(url.pathname, '/a/b/c');
      strictEqual(url.search, '?query=123&b=2');
      strictEqual(url.hash, '#hihi');
    });


  });

  describe('#state', function() {

    it('should be a function', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      strictEqual(typeof locationService.state, 'function');
    });

    it('should return current state', function () {
      let myState = { hi: Math.random() },
          data = { state: myState };
      const $$locationSourceHandler = createLocationSourceHandler(data);
      let locationService = new LocationService($$locationSourceHandler);

      strictEqual(JSON.stringify(locationService.state()), JSON.stringify(myState));
    });

  });

  describe('#title', function() {

    it('should be a function', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      strictEqual(typeof locationService.title, 'function');
    });

    it('should return current title', function () {
      let data = { title: 'My title' };
      const $$locationSourceHandler = createLocationSourceHandler(data);
      let locationService = new LocationService($$locationSourceHandler);
      strictEqual(locationService.title(), 'My title');
    });

  });

  describe('#set', function() {

    it('should be a function', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      strictEqual(typeof locationService.set, 'function');
    });

    it('should return itself', function () {
      const $$locationSourceHandler = createLocationSourceHandler();
      let locationService = new LocationService($$locationSourceHandler);
      strictEqual(locationService.set({}), locationService);
    });

    it('should be able to set current path', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      locationService.set({ pathname: '/ab' });
      strictEqual(locationService.url().pathname, '/ab');
    });

    it('should be able to set current state', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      const newState = { foo: Math.random() };
      locationService.set({ state: newState });
      strictEqual(JSON.stringify(locationService.state()), JSON.stringify(newState));
    });

    it('should be able to set current title', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      locationService.set({ title: 'My title' });
      strictEqual(locationService.title(), 'My title');
    });

    it('should iterate over all .use functions and allow them to change the suggested location data', function () {
      const useHandler = (data) => ((data.pathname === '/forbidden')? Object.assign(data, { pathname: '/allowed' }) : data);

      let locationService = new LocationService(createLocationSourceHandler());
      locationService.use(useHandler);
      locationService.set({ pathname: '/forbidden', title: 'Start Page' });
      strictEqual(locationService.url().pathname, '/allowed');
      strictEqual(locationService.title(), 'Start Page');
    });

    it('should abort the operation if any of the use-handlers return none-objects', function () {
      const useHandler = (data) => ((data.pathname === '/forbidden')? null : data);

      let locationService = new LocationService(createLocationSourceHandler());
      locationService.use(useHandler);
      locationService.set({ pathname: '/index', title: 'Start Page' });
      locationService.set({ pathname: '/forbidden' });
      strictEqual(locationService.url().pathname, '/index');
      strictEqual(locationService.title(), 'Start Page');
    });

  });

  describe('#replace', function() {

    it('should be a function', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      strictEqual(typeof locationService.replace, 'function');
    });

    it('should return itself', function () {
      const $$locationSourceHandler = createLocationSourceHandler();
      let locationService = new LocationService($$locationSourceHandler);
      strictEqual(locationService.replace({}), locationService);
    });

    it('should be able to set current path', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      locationService.replace({ pathname: '/ab' });
      strictEqual(locationService.url().pathname, '/ab');
    });

    it('should be able to set current state', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      const newState = { foo: Math.random() };
      locationService.replace({ state: newState });
      strictEqual(JSON.stringify(locationService.state()), JSON.stringify(newState));
    });

    it('should be able to set current title', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      locationService.replace({ title: 'My title' });
      strictEqual(locationService.title(), 'My title');
    });

    it('should iterate over all .use functions and allow them to change the suggested location data', function () {
      const useHandler = (data) => ((data.pathname === '/forbidden')? Object.assign(data, { pathname: '/allowed' }) : data);

      let locationService = new LocationService(createLocationSourceHandler());
      locationService.use(useHandler);
      locationService.replace({ pathname: '/forbidden', title: 'Start Page' });
      strictEqual(locationService.url().pathname, '/allowed');
      strictEqual(locationService.title(), 'Start Page');
    });

    it('should abort the operation if any of the use-handlers return none-objects', function () {
      const useHandler = (data) => ((data.pathname === '/forbidden')? null : data);

      let locationService = new LocationService(createLocationSourceHandler());
      locationService.use(useHandler);
      locationService.replace({ pathname: '/index', title: 'Start Page' });
      locationService.replace({ pathname: '/forbidden' });
      strictEqual(locationService.url().pathname, '/index');
      strictEqual(locationService.title(), 'Start Page');
    });

  });

  describe('#subscribe', function() {

    it('should be a function', function () {
      let locationService = new LocationService(createLocationSourceHandler());
      strictEqual(typeof locationService.subscribe, 'function');
    });

    it('should return an unsubscribe fucntion', function () {
      const handler = () => null;
      const locationService = new LocationService(createLocationSourceHandler());
      const unsubscribe = locationService.subscribe(handler);

      strictEqual(typeof unsubscribe, 'function');
    });

    it('should be invoked directly with the current url', function () {
      let invokeCount = 0;
      const handler = () => (++invokeCount);
      let locationService = new LocationService(createLocationSourceHandler());
      locationService.subscribe(handler);
      strictEqual(invokeCount, 1);
    });

    it('should not be added multiple times if subscribed multiple times', function () {
      let invokeCount = 0;
      const handler = () => (++invokeCount);
      let locationService = new LocationService(createLocationSourceHandler());
      locationService.subscribe(handler);
      locationService.subscribe(handler);
      locationService.subscribe(handler);
      strictEqual(invokeCount, 1);
    });

    it('should be invoked for each time path changes', function () {
      let invokeCount = 0;
      const handler = () => (++invokeCount);
      let locationService = new LocationService(createLocationSourceHandler());
      locationService.subscribe(handler);
      locationService.set({ pathname: '/abc' });
      strictEqual(invokeCount, 2);
    });

    it('should be invoked for each time state changes', function () {
      let invokeCount = 0;
      const handler = () => (++invokeCount);
      let locationService = new LocationService(createLocationSourceHandler());
      locationService.subscribe(handler);
      locationService.set({ state: { name: 'John Doe' } });
      strictEqual(invokeCount, 2);
    });

    it('should be invoked for each time title changes', function () {
      let invokeCount = 0;
      const handler = () => (++invokeCount);
      let locationService = new LocationService(createLocationSourceHandler());
      locationService.subscribe(handler);
      locationService.set({ title: 'Just a test' });
      strictEqual(invokeCount, 2);
    });

    it('should handle external changes', function () {
      let invokeCount = 0;
      const handler = () => (++invokeCount);
      let $$locationSourceHandler = createLocationSourceHandler(),
          locationService = new LocationService($$locationSourceHandler);

      locationService.subscribe(handler);
      $$locationSourceHandler.setLocation(null, 'title', 'http://localhost:8080/');
      strictEqual(invokeCount, 2);
    });

    it('should be invoked with correct parameters', function () {
      let invokeCount = 0;
      const myState = { random: Math.random() };
      const handler = (url, state, title) => {
        ++invokeCount;
        strictEqual(url, 'http://localhost:8080/hello-world');
        strictEqual(JSON.stringify(state), JSON.stringify(myState));
        strictEqual('Hello world', title);
      };
      let $$locationSourceHandler = createLocationSourceHandler(),
          locationService = new LocationService($$locationSourceHandler);

      $$locationSourceHandler.setLocation(myState, 'Hello world', 'http://localhost:8080/hello-world');
      locationService.subscribe(handler);

      strictEqual(invokeCount, 1);
    });

    it('should not invoke subscribers again if all parameters is identical', function () {
      let invokeCount = 0;
      const myState = { random: Math.random() };
      const handler = (url, state, title) => {
        ++invokeCount;
        strictEqual(url, 'http://localhost:8080/hello-world');
        strictEqual(JSON.stringify(state), JSON.stringify(myState));
        strictEqual('Hello world', title);
      };
      let $$locationSourceHandler = createLocationSourceHandler(),
          locationService = new LocationService($$locationSourceHandler);

      $$locationSourceHandler.setLocation(myState, 'Hello world', 'http://localhost:8080/hello-world');
      locationService.subscribe(handler);
      $$locationSourceHandler.setLocation(myState, 'Hello world', 'http://localhost:8080/hello-world');
      strictEqual(invokeCount, 1);
    });

  });

  describe('component test', function() {

    it('should pass all external changes through use-handler list', function () {
      const useHandler = (data) => ((data.pathname === '/forbidden')? Object.assign(data, { pathname: '/allowed' }) : data);
      let $$locationSourceHandler = createLocationSourceHandler(),
          locationService = new LocationService($$locationSourceHandler);

      locationService.use(useHandler);

      $$locationSourceHandler.setLocation({}, 'title', 'http://localhost/forbidden');
      strictEqual(locationService.url().pathname, '/allowed');
    });

  })

});