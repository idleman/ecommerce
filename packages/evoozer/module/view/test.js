import assert from 'assert';
import Module from '../module';
import view from './view';

const strictEqual = assert.strictEqual.bind(assert);

describe('module/view', function() {

  it('should be a module', function () {
    strictEqual(view instanceof Module, true);
  });

  it('should be able to initiate it', function (next) {
    const instance = view.createInstance();
    instance.initiate()
      .then(next.bind(null, null), next);
  });

});