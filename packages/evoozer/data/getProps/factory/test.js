import assert from 'assert';
import getPropsFactory from './getPropsFactory';

const { strictEqual } = assert;

describe('getPropsFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof getPropsFactory, 'function');
  });

  it('should return a function', function() {
    const getProps = getPropsFactory();
    strictEqual(typeof getProps, 'function');
  });

  describe('getProps', function() {

    it('should return a empty object as default', function() {
      const getProps = getPropsFactory();
      const props = getProps();
      const expected = {};
      strictEqual(JSON.stringify(props), JSON.stringify(expected));
    });

    it('should return complete props object', function() {
      const getProps = getPropsFactory();
      const props = {};
      strictEqual(getProps(null, props), props);
    });

  });

});
