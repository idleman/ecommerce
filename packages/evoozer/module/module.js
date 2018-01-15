/**
 * flow: init => run all
 *
 *
 * @type {Module}
 */
import Injector from '../injector';

const isArray = obj => Array.isArray(obj);
const isString = obj => typeof obj === 'string';
//const isUndefined = obj => typeof obj === 'undefined';
//const isNull = obj => obj === null;
//const isUndefinedOrNull = obj => isUndefined(obj) || isNull(obj);
const getDependencyParam = params => isArray(params[1]) ? params[1] : (isArray(params[0])? params[0] : []);
const getNamespaceParam = params => isString(params[0]) ? params[0] : '';

//
// function getDependencyName(dependency) {
//   switch(typeof dependency) {
//     case 'string':
//       return dependency;
//     case 'function':
//       return typeof dependency.getName === 'function' ? dependency.getName() : dependency.name;
//     default:
//       return dependency;
//   }
// }


class Instance {

  constructor(module, parentInstance = null) {
    const queue = [];
    const workers = [];
    const require = this.require.bind(this);
    const injector = new Injector({ require });
    const moduleMapInstances = new Map();
    const pollData = { watchers: [], map: new Map() };
    this._Instance = {
      queue,
      workers,
      module,
      injector,
      pollData,
      parentInstance,
      moduleMapInstances
    };

    //this.require = this.wrap(this.require.bind(this));
    const $construct = this.construct.bind(this); //
    const $invoke = this.wrap((...args) => this.invoke(...args));
    injector.constant('$construct', $construct);
    injector.constant('$invoke', $invoke);
  }


  getRootInstance() {
    let instance = this;
    while(true) {
      const { parentInstance } = instance._Instance;
      if(parentInstance) {
        instance = parentInstance;
        continue;
      }
      break;
    }
    return instance;
  }

  post(...args) {
    const dataMap = this._Instance;
    const { queue } = dataMap;
    args.forEach(cb => queue.push(cb));
  }

  getInstanceReference(moduleDependency) {
    const rootInstance = this.getRootInstance();
    const { moduleMapInstances } = rootInstance._Instance;
    let reference = moduleMapInstances.get(moduleDependency);
    if(reference) {
      return reference;
    }
    reference = moduleDependency.createInstance(this);
    moduleMapInstances.set(moduleDependency, reference);
    return reference;
  }

  getInstanceDependencies() {
    const dataMap = this._Instance;
    if(!dataMap.instanceDependencies) {
      const { module } = dataMap;
      const { dependencies } = module._Module;
      dataMap.instanceDependencies = dependencies.map(dependency => this.getInstanceReference(dependency));
    }
    return dataMap.instanceDependencies;
  }

  getInstanceFromDependency(dependency) {
    const { injector } = this._Instance;
    if(injector.has(dependency)) {
      return this;
    }
    const instanceDependencies = this.getInstanceDependencies();
    const result = instanceDependencies.find(instance => instance.getInstanceFromDependency(dependency));
    return result ? result : null;
  }

  require(dependency) {
    const { injector, parentInstance } = this._Instance;
    if(injector.has(dependency)) {
      return injector.require(dependency);
    }

    const instance = this.getInstanceFromDependency(dependency);
    if(instance) {
      return instance.require(dependency);
    }

    if(parentInstance) {
      return parentInstance.require(dependency);
    }

    return Promise.reject(new Error(`Cannot find dependency: ${dependency}`));
  }

  _getLocals(cb) {
    const { injector } = this._Instance;
    const annotations = injector.annotate(cb);
    const dependencies = annotations.map(dependency => this.require(dependency));
    const callCallback = (deps) => {
      const combine = (locals, name, index) => {
        locals[name] = deps[index];
        return locals;
      };
      return annotations.reduce(combine, {});
    };
    return Promise.all(dependencies)
      .then(callCallback);
  }

  invoke(...args) {
    const { injector } = this._Instance;
    return injector.invoke(...args);
  }

  construct(...args) {
    const { injector } = this._Instance;
    return injector.construct(...args);
  }

  poll() {
    return new Promise((resolve, reject) => {
      const dataMap = this._Instance;
      const { queue, pollData } = dataMap;
      const { watchers, map } = pollData;

      //   in progress
      watchers.push({ resolve, reject });

      const doResolve = () => {
        watchers.forEach(watcher => watcher.resolve());
        watchers.length = 0;
      };
      const doReject = (err) => {
        watchers.forEach(watcher => watcher.reject(err));
        watchers.length = 0;
      };


      const notify = () => {
        if(!queue.length && map.size === 0) {
          return doResolve();
        }

        while(queue.length) {
          const cb = queue.shift();
          const promise = this.invoke(cb);
          map.set(cb, promise);

          const onCompletion = (err) => {
            map.delete(cb);
            if(err) {
              return doReject(err);
            }
            notify();
          };

          promise.then(onCompletion.bind(null, null), onCompletion);
        }
      };

      notify();
    });
  }

  pollAll() {
    const dataMap = this._Instance;
    const { parentInstance, moduleMapInstances } = dataMap;
    if (parentInstance) {
      return;
    }
    const instances = Array.from(moduleMapInstances.values()).concat(this);
    return Promise.all(instances.map(instance => instance.poll()));
  }

  wrap(cb) {
    return (...args) => {
      return new Promise((resolve, reject) => {
        //console.log('wrap post');
        this.post(() => cb(...args).then(resolve, reject));
        this.poll();
      });
    };
  }

  configure() {
    const dataMap = this._Instance;
    if(!dataMap.configure) {
      dataMap.configure  = new Promise((resolve, reject) => {
        const configureInstanceDependencies = () => Promise.all(this.getInstanceDependencies().map(instance => instance.configure()));

        const configureInstance = () => {
          const { module, injector } = this._Instance;
          const { config, constant, provider } = module._Module;
          const constructorProviderOptions = { isConstructor: true };
          constant.forEach((value, identifier) => injector.constant(identifier, value));
          provider.forEach((Constructor, name) => injector.service(`${name}Provider`, Constructor));
          config.forEach(cb => this.post(cb));
          return this.pollAll();
        };
        configureInstanceDependencies()
          .then(configureInstance)
          .then(resolve, reject)

      });
    }
    return dataMap.configure;
  }


  initiate() {
    const dataMap = this._Instance;
    if(!dataMap.initiate) {
      dataMap.initiate = new Promise((resolve, reject) => {
        const initiateInstanceDependencies = () => Promise.all(this.getInstanceDependencies().map(instance => instance.initiate()));

        const initiateInstance = () => {

          const { module, injector } = this._Instance;
          const { run, factory, provider } = module._Module;
          const injectorOptions = { isConstructor: false };
          factory.forEach((value, name) => injector.factory(name, value), injectorOptions);
          provider.forEach((value, name) => injector.factory(name, [`${name}Provider`, provider => provider.$get()]));
          run.forEach(cb => this.post(cb));
          return this.pollAll();
        };

        return this.configure()
          .then(initiateInstanceDependencies)
          .then(initiateInstance)
          .then(resolve, reject)
      });
    }
    return dataMap.initiate;
  }

}

export default class Module {

  constructor(...args) {
    const dependencies = getDependencyParam(args);
    const namespace = getNamespaceParam(args);
    const factory = new Map();
    const constant = new Map();
    const provider = new Map();
    const config = new Set();
    const run = new Set();

    this._Module = {
      run,
      namespace,
      config,
      factory,
      constant,
      provider,
      dependencies
    };
  }


  constant(name, value) {
    return this._set('constant', name, value);
  }

  factory(name, cb) {
    return this._set('factory', name, cb);
  }

  provider(name, cb) {
    return this._set('provider', name, cb);
  }

  _set(type, name, value) {
    const map = this._Module[type];
    if(typeof value === 'undefined') {
      return map.get(name);
    }
    if(map.has(name)) {
      throw new Error('Already exists');
    }
    map.set(name, value);
    return this;
  }

  config(...args) {
    const { config } = this._Module;
    args.forEach(cb => config.add(cb));
    return this;
  }

  run(...args) {
    const { run } = this._Module;
    args.forEach(cb => run.add(cb));
    return this;
  }


  createInstance(parentInstance = null) {
    return new Instance(this, parentInstance);
  }

};
