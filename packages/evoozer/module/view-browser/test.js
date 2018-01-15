import assert from 'assert';
import Module from '../module'
import viewBrowser from './view-browser';

const strictEqual = assert.strictEqual.bind(assert);

describe('module/view-browser', function() {

  it('should be a module', function () {
    strictEqual(viewBrowser instanceof Module, true);
  });

  it('should be able to initiate it', function (next) {
    const instance = viewBrowser.createInstance();
    instance.initiate()
      .then(next.bind(null, null), next);
  });

});