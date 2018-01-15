import assert from 'assert';
import Injector from './injector';
const strictEqual = assert.strictEqual.bind(assert);
const notStrictEqual = assert.notStrictEqual.bind(assert);


describe('Injector', function() {

  describe('#constructor', function() {

    it('should be a function', function() {
      strictEqual(typeof Injector, 'function');
    });

    it('should return an instance of Injector', function() {
      let injector = new Injector();
      strictEqual(injector instanceof Injector, true);
    });

  });

  describe('#annotate', function() {

    it('should be a function', function() {
      const injector = new Injector();
      strictEqual(typeof injector.annotate, 'function');
    });

    it('should return an empty array if provided with a single function without any $inject property', function() {
      const h = () => 123;
      const injector = new Injector();
      const dependencies = injector.annotate(h);

      strictEqual(Array.isArray(dependencies), true);
      strictEqual(dependencies.length, 0);
    });

    it('should return all dependencies if provided with a annotation-array', function() {
      const h = ['version', (version) => version];

      const injector = new Injector();
      const dependencies = injector.annotate(h);
      strictEqual(JSON.stringify(dependencies), '["version"]');
    });


    it('should return all dependencies if provided with an object with an $inject-property', function() {
      const F = function(version) { return version; };
      F.$inject = ['version'];

      const injector = new Injector();
      const dependencies = injector.annotate(F);

      strictEqual(JSON.stringify(dependencies), '["version"]');
    });

    it('should work with names', function() {
      const F = function(version) { return version; };
      F.$inject = ['version'];

      const name = 'dependency';
      const injector = new Injector();

      injector.factory(name, F);
      const dependencies = injector.annotate(name);

      strictEqual(JSON.stringify(dependencies), '["version"]');
    });

  });

  describe('#set', function() {

    it('should be a function', function() {
      const injector = new Injector();
      strictEqual(typeof injector.set, 'function');
    });

    it('should return itself', function() {
      const injector = new Injector();
      const F = function() { };
      strictEqual(injector.set(F, F), injector);
    });

  });

  describe('#has', function() {

    it('should be a function', function() {
      const injector = new Injector();
      strictEqual(typeof injector.has, 'function');
    });

    it('should return false as default', function() {
      const injector = new Injector();
      const F = function() { };
      strictEqual(injector.has(F), false);
      strictEqual(injector.has('Hello'), false);
    });

    it('should return true if previously set with .set', function() {
      const injector = new Injector();
      const F = function() { };
      injector.set(F, F);
      injector.set('Hello', F);
      strictEqual(injector.has(F), true);
      strictEqual(injector.has('Hello'), true);
    });

  });

  // We want a way to externalize a depdency and if its API support externalize it to a complete seperate
  // process, we want to support it (by allow overloading the internal API to actually store a such "actor"
  // for this do we need:
  //
  //  A function to detect all dependencies
  //  A way for a dependency to notify if it has external dependency (global variable/none standard)
  //  A (on instance module) function to replace all internal
  describe('#dependencies', function() {

    it('should be a function', function() {
      const injector = new Injector();
      strictEqual(typeof injector.dependencies, 'function');
    });

    it('should  be able to receive all dependencies, including transitive dependencies" ', function() {
      const first = () => 1;
      const second = ['first', first => first + 1];
      const third = ['second', second => second + 1];
      const person = ['third', 'third', (a, b) => (a + b)];
      const injector = new Injector();
      injector.factory('first', first);
      injector.factory('second', second);
      injector.factory('third', third);
      const dependencies = injector.dependencies(person);

      strictEqual(Array.isArray(dependencies), true);
      strictEqual(dependencies.length, 3);
      notStrictEqual(dependencies.indexOf('first'), -1);
      notStrictEqual(dependencies.indexOf('second'), -1);
      notStrictEqual(dependencies.indexOf('third'), -1);
    });

  });

  describe('#externals', function() {

    it('should be a function', function() {
      const injector = new Injector();
      strictEqual(typeof injector.dependencies, 'function');
    });

    it('should  be able to receive all dependencies, including transitive dependencies" ', function() {
      const first = () => 1;
      const second = ['first', first => first + 1];
      const third = ['second', second => second + 1];
      const person = ['third', 'third', (a, b) => (a + b)];
      const injector = new Injector();
      injector.factory('first', first);
      injector.factory('second', second);
      injector.factory('third', third);
      const dependencies = injector.dependencies(person);

      strictEqual(Array.isArray(dependencies), true);
      strictEqual(dependencies.length, 3);
      notStrictEqual(dependencies.indexOf('first'), -1);
      notStrictEqual(dependencies.indexOf('second'), -1);
      notStrictEqual(dependencies.indexOf('third'), -1);
    });

  });


  function createClass(options = {}) {
    const { $inject = [], history = [], methodName = 'foo', methodImpl = function() {} } = options;
    return class GeneratedClass {

      static get $inject() {
        return $inject;
      }

      constructor(...args) {
        history.push(args);
        this._Generator = {
          args
        };
      }

      args() {
        return this._Generator.args;
      }

      [methodName](...args) {
        return methodImpl.apply(this, args);
      }

    };
  }


  describe('#construct', function() {
    // always construct, but get only construct once
    it('should be a function', function() {
      const injector = new Injector();
      strictEqual(typeof injector.construct, 'function');
    });

    it('should return a promise', function() {
      const injector = new Injector();
      const F = createClass();
      const promise = injector.construct(F);
      strictEqual(typeof promise.then, 'function');
      promise.then(null,  null);
    });

    it('should construct the provided function resolve its instance with its dependencies', function(next) {
      const firstName = 'John';
      const lastName = 'Doe';

      const Person = createClass({
        $inject: ['firstName', 'lastName'],
        methodName: 'getName',
        methodImpl: function() {
          const args = [].concat(this.args());
          const [firstName, lastName] = args;
          return `${firstName} ${lastName}`
        }
      });
      const injector = new Injector();

      injector.constant('firstName', firstName);
      injector.constant('lastName', lastName);


      const onResolve = (person) => {
        strictEqual(person instanceof Person, true);
        strictEqual(person.getName(), 'John Doe');
      };

      injector.construct(Person)
        .then(onResolve)
        .then(next.bind(null, null), next);
    });

    it('should be able to construct by string value', function(next) {
      const firstName = 'John';
      const lastName = 'Doe';

      const Person = createClass({
        $inject: ['firstName', 'lastName'],
        methodName: 'getName',
        methodImpl: function() {
          const args = [].concat(this.args());
          const [firstName, lastName] = args;
          return `${firstName} ${lastName}`
        }
      });
      const injector = new Injector();

      injector.constant('firstName', firstName);
      injector.constant('lastName', lastName);
      injector.service('person', Person);


      const onResolve = (person) => {
        strictEqual(person instanceof Person, true);
        strictEqual(person.getName(), 'John Doe');
      };

      injector.construct('person')
        .then(onResolve)
        .then(next.bind(null, null), next);
    });

    it('should be able to override current value with second argument', function(next) {
      const firstName = 'John';
      const lastName = 'Doe';

      const Person = createClass({
        $inject: ['firstName', 'lastName'],
        methodName: 'getName',
        methodImpl: function() {
          const args = [].concat(this.args());
          const [firstName, lastName] = args;
          return `${firstName} ${lastName}`
        }
      });
      const injector = new Injector();

      injector.constant('firstName', firstName);
      injector.constant('lastName', lastName);


      const onResolve = (person) => {
        strictEqual(person instanceof Person, true);
        strictEqual(person.getName(), 'Override Doe');
      };

      injector.construct(Person, { firstName: 'Override' })
        .then(onResolve)
        .then(next.bind(null, null), next);
    });

    it('should be possible to construct multiple instances of the same constructor', function(next) {
      const firstName = 'John';
      const lastName = 'Doe';

      const Person = createClass({
        $inject: ['firstName', 'lastName'],
        methodName: 'getName',
        methodImpl: function() {
          const args = [].concat(this.args());
          const [firstName, lastName] = args;
          return `${firstName} ${lastName}`
        }
      });
      const injector = new Injector();

      injector.constant('firstName', firstName);
      injector.constant('lastName', lastName);


      const onResolve = (persons) => {
        strictEqual(persons.length, 2);
        notStrictEqual(persons[0], persons[1]);
        persons.forEach(person => {
          strictEqual(person instanceof Person, true);
          strictEqual(person.getName(), 'John Doe');
        });
      };

      Promise.all([injector.construct(Person), injector.construct(Person)])
        .then(onResolve)
        .then(next.bind(null, null), next);
    });

  });

  describe('#require', function() {
    // always construct, but get only construct once
    it('should be a function', function() {
      const injector = new Injector();
      strictEqual(typeof injector.require, 'function');
    });

    it('should return a promise', function() {
      const injector = new Injector();
      const F = createClass();
      const promise = injector.require(F);
      strictEqual(typeof promise.then, 'function');
      promise.then(null,  null);
    });
  });

  describe('#constant', function() {

    it('should be a function', function() {
      let injector = new Injector();
      strictEqual(typeof injector.constant, 'function');
    });

    it('should return itself', function() {
      let injector = new Injector();
      strictEqual(injector.constant('version', 123), injector);
    });

  });

  describe('#factory', function() {

    it('should be a function', function() {
      let injector = new Injector();
      strictEqual(typeof injector.factory, 'function');
    });

    it('should return itself', function() {
      let injector = new Injector();
      strictEqual(injector.factory('version', () => null), injector);
    });

  });

  describe('#set', function() {

    it('should be a function', function() {
      let injector = new Injector();
      strictEqual(typeof injector.set, 'function');
    });

    it('should return itself', function() {
      let injector = new Injector();
      strictEqual(injector.set('version', () => null), injector);
    });

  });

  describe('#has', function() {

    it('should be a function', function() {
      let injector = new Injector();
      strictEqual(typeof injector.has, 'function');
    });

    it('should return true if value exists', function() {
      let injector = new Injector();
      strictEqual(injector.has('version'), false);
      injector.constant('version', 123);
      strictEqual(injector.has('version'), true);
      strictEqual(injector.has('error'), false);
      injector.constant('error', new Error('MyError'));
      strictEqual(injector.has('error'), true);
    });

  });


  describe('#invoke', function() {

    it('should be a function', function() {
      const injector = new Injector();
      strictEqual(typeof injector.invoke, 'function');
    });

    it('should return a promise', function() {
      const injector = new Injector();
      const h = function() { };
      const promise = injector.invoke(h);
      strictEqual(typeof promise.then, 'function');
    });

    it('should invoke the provided function and return its value', function(next) {
      const fn = () => 123;
      const injector = new Injector();

      const onResolve = (val) => {
        strictEqual(val, 123);
      };

      injector.invoke(fn)
        .then(onResolve)
        .then(next.bind(null, null), next);
    });

    it('should allow to overwrite dependencies in second (locals) parameter', function(next) {
      const injector = new Injector();
      let invokedWith = null;

      const onResolve = () => {
        strictEqual(invokedWith, 321);
      };

      injector.invoke(['version', (v) => (invokedWith = v) ], { version: 321 })
        .then(onResolve)
        .then(next.bind(null, null), next);
    });

    it('should resolve dependencies', function(next) {
      let injector = new Injector(),
        invokedWith = null;

      const onResolve = () => {
        strictEqual(invokedWith, 321);
      };
      const resolveMap = { version: 321 };
      injector.constant('version', 321);

      injector.invoke(['version', (v) => (invokedWith = v) ])
        .then(onResolve)
        .then(next.bind(null, null), next);
    });

    it('should resolve the returned promise', function(next) {
      let injector = new Injector();

      const onResolve = (version) => {
        strictEqual(version, 321);
      };
      const resolveMap = { version: 321 };
      injector.factory('version', () => Promise.resolve(321));

      injector.invoke(['version', (v) => v])
        .then(onResolve)
        .then(next.bind(null, null), next);
    });

  });

});