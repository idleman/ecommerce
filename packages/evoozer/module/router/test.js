import assert from 'assert';
import Module from '../module';
import router from './router';


const strictEqual = assert.strictEqual.bind(assert);

describe('module/router', function() {

  it('should be a module', function () {
    strictEqual(router instanceof Module, true);
  });

  it('should be able to initiate it', function (next) {
    const instance = router.createInstance();
    instance.initiate()
      .then(next.bind(null, null), next);
  });

});