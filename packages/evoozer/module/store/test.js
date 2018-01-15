import assert from 'assert';
import Module from '../module'
import store from './store';

const strictEqual = assert.strictEqual.bind(assert);

describe('module/store', function() {

  it('should be a module', function () {
    strictEqual(store instanceof Module, true);
  });

  it('should be able to initiate it', function (next) {
    const instance = store.createInstance();
    instance.initiate()
      .then(next.bind(null, null), next);
  });

});