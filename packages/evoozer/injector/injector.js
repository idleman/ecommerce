
export default class Injector {

  constructor(options = {}) {
    const handleMap = new Map(); // Must be a map because some keys may be functions
    const defaultRequire = (dependency) => Promise.reject(new Error(`Injector: Cannot require ${JSON.stringify(dependency)}`))
    const { require = defaultRequire } = options;
    this._Injector = {
      handleMap,
      require
    };
  }


  annotate(fn) {
    if(typeof fn === 'string') {
      const { handleMap } = this._Injector;
      const { cb } = handleMap.get(fn) || {};
      fn = cb;
    }
    return Array.isArray(fn) ? fn.slice(0, fn.length - 1) : [].concat(fn.$inject || []);
  }

  has(nameOrConstructor) {
    const { handleMap } = this._Injector;
    return handleMap.has(nameOrConstructor);
  }

  dependencies(fn) {
    const annotations = this.annotate(fn);
    const collect = (deps, dep) => deps.concat(this.dependencies(dep));
    return Array.from(new Set(annotations.reduce(collect, annotations))); // will remove duplicates
  }


  constant(name, value) {
    const { handleMap } = this._Injector;
    handleMap.set(name, { value });
    return this;
  }

  factory(name, value) {
    const isConstructor = false;
    return this.set(name, value, { isConstructor })
  }

  service(name, Constructor) {
    const isConstructor = true;
    return this.set(name, Constructor, { isConstructor });
  }

  set(name, cb, options) {
    const { handleMap } = this._Injector;
    const watchers = [];
    if(typeof this.handler(cb) !== 'function') {
      throw new Error('Injector: Value must be a function');
    }
    handleMap.set(name, {
      cb,
      watchers,
      options
    });
    return this;
  }

  require(name, locals = {}) {
    const localValue = locals[name];
    if(typeof localValue !== 'undefined') {
      return Promise.resolve(localValue);
    }
    const dataMap = this._Injector;
    const { handleMap } = dataMap;
    const valueMap = handleMap.get(name);
    if(!valueMap) {
      if(typeof name === 'function') {
        return this.construct(name, locals);
      }
      const { require } = dataMap;
      return require(name);
    }

    const { value } = valueMap;

    if(typeof value !== 'undefined') {
      return Promise.resolve(value);
    }

    return new Promise((resolve, reject) => {
      const { watchers, cb, options = {} } = valueMap;

      //   in progress
      watchers.push({ resolve, reject });

      if(watchers.length !== 1) {
        //  To prevent double instantiation
        return;
      }

      const onDependencies = (dependencies) => {
        const Constructor = this.handler(cb);
        const { isConstructor = Array.isArray(cb) } = options;
        return isConstructor ? new Constructor(...dependencies) : Constructor(...dependencies);
      };

      const onResolve = (value) => {
        valueMap.value = value;
        watchers.forEach(watcher => watcher.resolve(value));
      };

      const onReject = (err) => {
        watchers.forEach(watcher => watcher.reject(err));
      };


      Promise.all(this.annotate(cb).map(dependency => this.require(dependency)))
        .then(onDependencies)
        .then(onResolve)
        .then(null, onReject);
    });
  }

  construct(Constructor, locals = {}) {
    if(typeof Constructor === 'string') {
      return this.require(Constructor, locals);
    }

    const onDependencies = (dependencies) => new Constructor(...dependencies);
    const dependencies = this.annotate(Constructor).map(dependency => this.require(dependency, locals));

    return Promise.all(dependencies)
      .then(onDependencies);
  }

  handler(fn) {
    const result = Array.isArray(fn) ? fn[fn.length -1] : fn;
    return typeof result === 'function' ? result : () => null;
  }

  invoke(fn, locals = {}) {
    const onDependencies = (dependencies) => {
      const cb = this.handler(fn);
      return cb(...dependencies);
    };

    return Promise.all(this.annotate(fn).map(dependency => this.require(dependency, locals)))
      .then(onDependencies);
  }

};