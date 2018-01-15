import assert from 'assert';
import Module from '../module'
import http from './http';

const strictEqual = assert.strictEqual.bind(assert);

describe('module/http', function() {

  it('should be a module', function () {
    strictEqual(http instanceof Module, true);
  });

  it('should be able to initiate it', function (next) {
    const instance = http.createInstance();
    instance.initiate()
      .then(next.bind(null, null), next);
  });

});