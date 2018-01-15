import assert from 'assert';
import getProductItemIdFactory from './getProductItemIdFactory';

const { strictEqual } = assert;

describe('getProductItemIdFactory', function() {

  it('should be a function', function() {
    strictEqual(typeof getProductItemIdFactory, 'function');
  });

  it('should return a function', function() {
    const getProductItemId = getProductItemIdFactory();
    strictEqual(typeof getProductItemId, 'function');
  });

  describe('getProductItemId', function() {

    it('should return a empty string as default', function() {
      const getProductItemId = getProductItemIdFactory();
      const seq = getProductItemId(null, {});
      strictEqual(seq, '');
    });

    it('should return all props.productItemId', function() {
      const getProductItemId = getProductItemIdFactory();
      const dummy = 123;
      const productItemId = '8623';
      const result = getProductItemId(null, { dummy, productItemId });
      strictEqual(result, productItemId);
    });

  });

});
