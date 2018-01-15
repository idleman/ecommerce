import immutable from 'immutable';
import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';

export default class StoreProvider {

  static get $inject() {
    return ['$invoke'];
  }

  constructor($invoke) {
    const configure = [];
    const reducerMap = {};
    const enhancer = global.__REDUX_DEVTOOLS_EXTENSION__ ? global.__REDUX_DEVTOOLS_EXTENSION__() : undefined;
    this._StoreProvider = {
      $invoke,
      enhancer,
      configure,
      reducerMap
    };
  }

  reducer(name, reducer, initialState = {}) {
    const { reducerMap } = this._StoreProvider;

    if(typeof reducer === 'undefined') {
      const { reducer } = reducerMap[name] || {};
      return reducer;
    }

    reducerMap[name] = { reducer, initialState };
    return this;
  }

  enhancer(enhancer) {
    const dataMap = this._StoreProvider;
    if(typeof enhancer === 'undefined') {
      return dataMap.enhancer;
    }
    dataMap.enhancer = enhancer;
    return this;
  }

  configure(...args) {
    this._StoreProvider.configure.push(...args);
    return this;
  }

  $get() {
    return new Promise((resolve, reject) => {
      const { configure, $invoke, reducerMap } = this._StoreProvider;

      const onConfigured = () => {
        const combinedReducerShape = {};
        const reducerNames = Object.keys(reducerMap);
        const initialState = immutable.Map().withMutations(map => {
          reducerNames.forEach(name => {
            const { reducer, initialState } = reducerMap[name];
            map = map.set(name, initialState);
            combinedReducerShape[name] = reducer;
          });
          return map;
        });

        const reducer = reducerNames.length ? combineReducers(combinedReducerShape) : (state, action) => state;
        const enhancer = this.enhancer();
        return createStore(reducer, initialState, enhancer);
      };

      Promise.all(configure.map((cb) => $invoke(cb)))
        .then(onConfigured)
        .then(resolve, reject);
    });
  }

};