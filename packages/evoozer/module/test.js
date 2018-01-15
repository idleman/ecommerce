import assert from 'assert';
import Module from './module';

const strictEqual = assert.strictEqual.bind(assert);
const throws = assert.throws.bind(assert);


describe('Module', function() {

  describe('#constructor', function () {

    it('should be a function', function () {
      strictEqual(typeof Module, 'function');
    });

    it('should be constructable', function () {
      const module = new Module();
      strictEqual(module instanceof Module, true);
    });

  });


  ['factory', 'provider', 'constant'].forEach(methodName => {

    describe(`#${methodName}`, function () {

      it('should be a function', function () {
        const module = new Module();
        strictEqual(typeof module[methodName], 'function');
      });

      it('should return itself', function () {
        const name = 'name';
        const value = () => null;
        const module = new Module();
        const result = module[methodName](name, value);
        strictEqual(result, module);
      });

      it('should throw exception if invoked twice', function () {
        const name = 'name';
        const value = () => null;
        const module = new Module();
        const set = () => module[methodName](name, value);
        set();
        throws(set);
      });

    });

  });

  ['config', 'run'].forEach(methodName => {

    describe(`#${methodName}`, function () {

      it('should be a function', function () {
        const module = new Module();
        strictEqual(typeof module[methodName], 'function');
      });

      it('should return itself', function () {
        const module = new Module();
        const handler = () => null;
        strictEqual(module[methodName](handler), module);
      });

    });

  });

  function createPushFunctor(arr, returnValue) {
    return (...args) => {
      arr.push(args);
      return returnValue;
    };
  }

  function createThrowFunctor(err) {
    return () => {
      throw err
    };
  }


  describe('#createInstance', function() {

    it('should be a function', function () {
      const module = new Module();
      strictEqual(typeof module.createInstance, 'function');
    });


    it('should an object', function() {
      const module = new Module();
      const instance = module.createInstance();
      strictEqual(typeof instance, 'object');
    });

  });

  describe('Instance', function() {

    describe('#configure', function() {

      it('should be a function', function () {
        const module = new Module();
        const instance = module.createInstance();
        strictEqual(typeof instance.configure, 'function');
      });


      it('should run all resolve config handlers', function(next) {
        const module = new Module();
        const invocations = [];

        module.config(createPushFunctor(invocations));

        const onResolve = function() {
          strictEqual(invocations.length, 1);
          strictEqual(invocations[0].length, 0);
        };


        const instance = module.createInstance();
        instance.configure()
          .then(onResolve)
          .then(next, next);
      });


      it('should catch exception in config handlers', function(next) {
        const myError = new Error('MyError');
        const module = new Module();

        module.config(createThrowFunctor(myError));

        const onReject = (err) => {
          strictEqual(err, myError);
          next();
        };


        const instance = module.createInstance();
        instance.configure()
          .then(next.bind(null, new Error('Expected to fail...')), onReject);
      });


      it('should wait for all dispatched events within the module to finnish before its resolve', function(next) {
        const module = new Module();
        const invocations = [];


        module.config(function() {
          return Promise.resolve('hello')
            .then(createPushFunctor(invocations, Promise.resolve('world')))
            .then(createPushFunctor(invocations));
        });

        const onResolve = function() {
          const expected = ['hello', 'world'];
          strictEqual(invocations.length, expected.length);
          expected.forEach((value, index) => {
            const args = invocations[index];
            strictEqual(args.length, 1);
            const got = args[0];
            strictEqual(value, got);
          });
        };


        const instance = module.createInstance();
        instance.configure()
          .then(onResolve)
          .then(next, next);
      });

      it('should be able to handle rejected-promises', function(next) {
        const module = new Module();
        const myError = new Error('MyError');
        const invocations = [];


        module.config(function() {
          return Promise.resolve('hello')
            .then(createPushFunctor(invocations, Promise.reject(myError)));
        });

        const onReject = (err) => {
          strictEqual(err, myError);
          next();
        };

        const instance = module.createInstance();
        instance.configure()
          .then(next.bind(null, new Error('Expected to fail...')), onReject);
      });

      it('should be able to dependency inject constants', function(next) {
        const version = 123;
        const age = 321;
        const module = new Module()
          .constant('version', version)
          .constant('age', age);

        const invocations = [];

        module.config(['version', 'age', createPushFunctor(invocations)]);

        const onResolve = function() {
          strictEqual(invocations.length, 1);
          const args = invocations[0];
          strictEqual(args.length, 2);
          strictEqual(args[0], version);
          strictEqual(args[1], age);
        };


        const instance = module.createInstance();
        instance.configure()
          .then(onResolve)
          .then(next, next);
      });

      it('should be able to dependency inject providers', function(next) {

        class FooProvider {

          static get $inject() {
            return ['version']
          }

          constructor(version) {
            this._Provider = {
              version
            };
          }

          getVersion() {
            return this._Provider.version;
          }

        }

        const version = 123;
        const module = new Module()
          .constant('version', version)
          .provider('foo', FooProvider);

        const invocations = [];

        module.config(['version', 'fooProvider', createPushFunctor(invocations)]);

        const onResolve = function() {
          strictEqual(invocations.length, 1);
          const args = invocations[0];
          strictEqual(args.length, 2);
          strictEqual(args[0], version);
          const fooProvider = args[1];
          strictEqual(typeof fooProvider, 'object');
          strictEqual(fooProvider.getVersion(), version);
        };


        const instance = module.createInstance();
        instance.configure()
          .then(onResolve)
          .then(next, next);
      });

    });

    describe('#initiate', function() {

      it('should be a function', function () {
        const module = new Module();
        const instance = module.createInstance();
        strictEqual(typeof instance.initiate, 'function');
      });


      it('should run all resolve run handlers', function(next) {
        const module = new Module();
        const invocations = [];

        module.run(createPushFunctor(invocations));

        const onResolve = function() {
          strictEqual(invocations.length, 1);
          strictEqual(invocations[0].length, 0);
        };


        const instance = module.createInstance();
        instance.initiate()
          .then(onResolve)
          .then(next, next);
      });


      it('should catch exception in run handlers', function(next) {
        const myError = new Error('MyError');
        const module = new Module();

        module.run(createThrowFunctor(myError));

        const onReject = (err) => {
          strictEqual(err, myError);
          next();
        };


        const instance = module.createInstance();
        instance.initiate()
          .then(next.bind(null, new Error('Expected to fail...')), onReject);
      });


      it('should wait for all dispatched events within the module to finnish before its resolve', function(next) {
        const module = new Module();
        const invocations = [];


        module.run(function() {
          return Promise.resolve('hello')
            .then(createPushFunctor(invocations, Promise.resolve('world')))
            .then(createPushFunctor(invocations));
        });

        const onResolve = function() {
          const expected = ['hello', 'world'];
          strictEqual(invocations.length, expected.length);
          expected.forEach((value, index) => {
            const args = invocations[index];
            strictEqual(args.length, 1);
            const got = args[0];
            strictEqual(value, got);
          });
        };


        const instance = module.createInstance();
        instance.initiate()
          .then(onResolve)
          .then(next, next);
      });

      it('should be able to handle rejected-promises', function(next) {
        const module = new Module();
        const myError = new Error('MyError');
        const invocations = [];


        module.run(function() {
          return Promise.resolve('hello')
            .then(createPushFunctor(invocations, Promise.reject(myError)));
        });

        const onReject = (err) => {
          strictEqual(err, myError);
          next();
        };

        const instance = module.createInstance();
        instance.initiate()
          .then(next.bind(null, new Error('Expected to fail...')), onReject);
      });

      it('should be able to dependency inject constants', function(next) {
        const version = 123;
        const age = 321;
        const module = new Module()
          .constant('version', version)
          .constant('age', age);

        const invocations = [];

        module.run(['version', 'age', createPushFunctor(invocations)]);

        const onResolve = function() {
          strictEqual(invocations.length, 1);
          const args = invocations[0];
          strictEqual(args.length, 2);
          strictEqual(args[0], version);
          strictEqual(args[1], age);
        };


        const instance = module.createInstance();
        instance.initiate()
          .then(onResolve)
          .then(next, next);
      });

      it('should be able to dependency inject factories', function(next) {
        const version = 123;
        const age = 321;
        const module = new Module()
          .constant('version', version)
          .factory('age', () => Promise.resolve(age));

        const invocations = [];

        module.run(['version', 'age', createPushFunctor(invocations)]);

        const onResolve = function() {
          strictEqual(invocations.length, 1);
          const args = invocations[0];
          strictEqual(args.length, 2);
          strictEqual(args[0], version);
          strictEqual(args[1], age);
        };


        const instance = module.createInstance();
        instance.initiate()
          .then(onResolve)
          .then(next, next);
      });

      it('should be able to dependency inject providers', function(next) {

        class Foo {

          static get $inject() {
            return ['version']
          }

          constructor(version) {
            this._Foo = {
              version
            };
          }

          getVersion() {
            return this._Foo.version;
          }

        }

        class FooProvider {

          static get $inject() {
            return ['version', '$construct']
          }

          constructor(version, $construct) {
            this._Provider = {
              version,
              $construct
            };
          }

          $get() {
            const { $construct } = this._Provider;
            return $construct(Foo);
          }

        }

        const version = 123;
        const module = new Module()
          .constant('version', version)
          .provider('foo', FooProvider);

        const invocations = [];

        module.run(['version', 'foo', createPushFunctor(invocations)]);

        const onResolve = function(data) {
          strictEqual(invocations.length, 1);
          const args = invocations[0];
          strictEqual(args.length, 2);
          strictEqual(args[0], version);
          const foo = args[1];
          strictEqual(typeof foo, 'object');

          strictEqual(foo.getVersion(), version);
        };


        const instance = module.createInstance();
        instance.initiate()
          .then(onResolve)
          .then(next, next);
      });

    });

  });

  describe('component', function() {

    function createHttpProvider() {
      class Http {
      }

      return class HttpProvider {

        static get $inject() {
          return ['$construct'];
        }

        static get Http() {
          return Http;
        }

        constructor($construct) {
          this._HttpProvider = {
            $construct
          };
        }

        $get() {
          const {$construct} = this._HttpProvider;
          return $construct(Http);
        }

      };
    }

    class API {

      static get $inject() {
        return ['http']
      }

      constructor(http) {
        this._API = {
          http
        };
      }

      getHttp() {
        return this._API.http;
      }

    }

    class APIProvider {

      static get $inject() {
        return ['$construct'];
      }

      constructor($construct) {
        this._HttpProvider = {
          $construct
        };
      }

      $get() {
        const { $construct } = this._HttpProvider;
        return $construct(API);
      }

    }



    it('should work across multiple modules', function(next) {
      const HttpProvider = createHttpProvider();
      const Http = HttpProvider.Http;
      const httpModule = new Module('http', [])
          .provider('http', HttpProvider);

      const module = new Module('api', [ httpModule ])
          .provider('api', APIProvider);

      const invocations = [];

      module.run(['http', 'api', createPushFunctor(invocations)]);

      const onResolve = function() {
        strictEqual(invocations.length, 1);
        const args = invocations[0];
        strictEqual(args.length, 2);
        const [http, api] = args;
        strictEqual(http instanceof Http, true);
        strictEqual(api instanceof API, true);
        strictEqual(api.getHttp(), http);
      };


      const instance = module.createInstance();
      instance.initiate()
        .then(onResolve)
        .then(next, next);
    });

    it('should be able to overwrite previous providers defined in a dependency', function(next) {

      const HttpProvider = createHttpProvider();
      const Http = HttpProvider.Http;
      const invocations = [];

      const httpModule = new Module('http', [])
        .provider('http', HttpProvider)
        .config(['httpProvider', createPushFunctor(invocations)]) // should use its http provider version
        .run(['http', createPushFunctor(invocations)]); // should use its http version

      const APIHttpProvider = createHttpProvider();
      const APIHttp = APIHttpProvider.Http;

      const module = new Module('api', [ httpModule ])
        .provider('http', APIHttpProvider)
        .config(['httpProvider', createPushFunctor(invocations)]) // should use its http provider version
        .run(['http', createPushFunctor(invocations)]); // should use its http version


      const onResolve = function() {
        strictEqual(invocations.length, 4);
        const expectedList = [HttpProvider, APIHttpProvider, Http, APIHttp];
        invocations.forEach((args, index) => {
          const expected = expectedList[index];
          const got = args[0];
          strictEqual(got instanceof expected, true);
        });
      };


      const instance = module.createInstance();
      instance.initiate()
        .then(onResolve)
        .then(next, next);
    });

    it('should be able to re-use common module (instances) to share common dependencies', function(next) {

      const HttpProvider = createHttpProvider();
      const Http = HttpProvider.Http;
      const invocations = [];

      const httpModule = new Module('http', [])
        .provider('http', HttpProvider)
        .config(['httpProvider', createPushFunctor(invocations)]) // should use its http provider version
        .run(['http', createPushFunctor(invocations)]); // should use its http version


      const firstModule = new Module('first', [ httpModule ])
        .config(['httpProvider', createPushFunctor(invocations)]) // should use its http provider version
        .run(['http', createPushFunctor(invocations)]); // should use its http version

      const secondModule = new Module('second', [ httpModule ])
        .config(['httpProvider', createPushFunctor(invocations)]) // should use its http provider version
        .run(['http', createPushFunctor(invocations)]); // should use its http version

      const module = new Module('test', [firstModule, secondModule]);

      const onResolve = function() {
        const expectedList = [HttpProvider, HttpProvider, HttpProvider, Http, Http, Http];
        strictEqual(invocations.length, expectedList.length);
        invocations.forEach((args, index) => {
          const expected = expectedList[index];
          const got = args[0];
          strictEqual(got instanceof expected, true);
        });
      };


      const instance = module.createInstance();
      instance.initiate()
        .then(onResolve)
        .then(next, next);
    });

    it('should continuously process and wait for all events to be processed', function(next) {

      const invocations = [];

      const pushParams = createPushFunctor(invocations);

      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      const module = new Module('module', [])
        .factory('setTimeout', ['$invoke', $invoke => {
          return function setTimeout(cb, ms) {
            const wait = () => {
              return Promise.resolve()
                .then(delay.bind(null, ms))
                .then(cb);
            };
            $invoke(wait);
          };
        }])
        .run(['setTimeout', (setTimeout) => {
          setTimeout(() => {
            pushParams('initial');
            setTimeout(() => {
              pushParams('second');
              setTimeout(() => {
                pushParams('third')
              }, 10);
            }, 10);
          }, 10);
        }]);

      const onResolve = function() {
        const expectedList = ['initial', 'second', 'third'];
        strictEqual(invocations.length, expectedList.length);
        invocations.forEach((args, index) => {
          const expected = expectedList[index];
          const got = args[0];
          strictEqual(got, expected, true);
        });
      };


      const instance = module.createInstance();
      instance.initiate()
        .then(onResolve)
        .then(next, next);
    });

    // it('should handle factories correctly', function(next) {
    //   class Person { }
    //   const module = new Module()
    //     .constant('firstName', 'John')
    //     .constant('lastName', 'Doe')
    //     .factory('Person', () => Person)
    //     .factory('person/john', ['person', 'firstName', 'lastName', (firstName, lastName) => {
    //       return class
    //     });
    //
    //   const invocations = [];
    //
    //   module.run(['version', 'age', createPushFunctor(invocations)]);
    //
    //   const onResolve = function() {
    //     strictEqual(invocations.length, 1);
    //     const args = invocations[0];
    //     strictEqual(args.length, 2);
    //     strictEqual(args[0], version);
    //     strictEqual(args[1], age);
    //   };
    //
    //
    //   const instance = module.createInstance();
    //   instance.initiate()
    //     .then(onResolve)
    //     .then(next, next);
    // });

    it('should have reasonable performance', function(next) {

      const HttpProvider = createHttpProvider();
      const Http = HttpProvider.Http;
      const invocations = [];

      const httpModule = new Module('http', [])
        .provider('http', HttpProvider)
        .config(['httpProvider', createPushFunctor(invocations)]) // should use its http provider version
        .run(['http', createPushFunctor(invocations)]); // should use its http version


      const firstModule = new Module('first', [ httpModule ])
        .config(['httpProvider', createPushFunctor(invocations)]) // should use its http provider version
        .run(['http', createPushFunctor(invocations)]); // should use its http version

      const secondModule = new Module('second', [ httpModule ])
        .config(['httpProvider', createPushFunctor(invocations)]) // should use its http provider version
        .run(['http', createPushFunctor(invocations)]); // should use its http version

      const module = new Module('test', [firstModule, secondModule]);

      let start = null;
      const onResolve = function() {
        const now = (new Date()).getTime();
        const time = now-start;
        strictEqual(time < 10, true);
      };


      start = (new Date()).getTime();
      const instance = module.createInstance();

      instance.initiate()
        .then(onResolve)
        .then(next, next);
    });

  });

});